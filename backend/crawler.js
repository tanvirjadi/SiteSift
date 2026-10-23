const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

// Dynamic User-Agent Pool for Stealth & Anti-Bot Evasion
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SiteSift/2.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SiteSift/2.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0 SiteSift/2.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 SiteSift/2.0'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(rawUrl) {
  let url = (rawUrl || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

/**
 * Checks if a host domain is alive via a lightweight HEAD ping
 */
async function pingDomain(hostname) {
  try {
    await axios.head(`https://${hostname}`, {
      timeout: 3500,
      headers: { 'User-Agent': getRandomUserAgent() },
      validateStatus: () => true,
    });
    return true;
  } catch {
    try {
      await axios.head(`http://${hostname}`, {
        timeout: 3500,
        headers: { 'User-Agent': getRandomUserAgent() },
        validateStatus: () => true,
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Anti-Bot & Cloudflare wall detector
 */
function detectAntiBotWall(statusCode, html = '') {
  if (statusCode === 403 || statusCode === 503) {
    const lower = html.toLowerCase();
    if (
      lower.includes('cloudflare') ||
      lower.includes('cf-browser-verification') ||
      lower.includes('challenge-platform') ||
      lower.includes('attention required') ||
      lower.includes('ddos-guard') ||
      lower.includes('akamai') ||
      lower.includes('bot detection')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Resilient Zero-G fetcher with exponential backoff & connection error deflection
 */
async function fetchWithResilience(targetUrl, retries = 1) {
  const normalized = normalizeUrl(targetUrl);
  const parsed = new URL(normalized);
  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    const startTime = Date.now();
    try {
      const response = await axios.get(normalized, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        timeout: 14000,
        maxRedirects: 5,
        validateStatus: (status) => status < 600, // Capture 500s internally
      });

      const responseTimeMs = Date.now() - startTime;
      const html = typeof response.data === 'string' ? response.data : '';

      // Check for Anti-Bot Challenge wall
      if (detectAntiBotWall(response.status, html)) {
        return {
          status: 'blocked',
          statusCode: response.status,
          cause: 'anti_scraping_wall',
          html,
          responseTimeMs,
          retriesAttempted: attempt,
        };
      }

      // Check for 5xx Server Error - attempt retry
      if (response.status >= 500) {
        throw new Error(`Target server returned HTTP ${response.status}`);
      }

      return {
        status: 'success',
        statusCode: response.status,
        html,
        responseTimeMs,
        retriesAttempted: attempt,
      };
    } catch (err) {
      lastError = err;
      attempt++;

      if (attempt <= retries) {
        // Delayed exponential backoff (1500ms * attempt)
        await delay(1500 * attempt);
      }
    }
  }

  // If retries exhausted, check if base domain is alive
  const domainAlive = await pingDomain(parsed.hostname);

  return {
    status: 'degraded',
    statusCode: lastError.response?.status || 504,
    cause: domainAlive ? 'page_unreachable_domain_alive' : 'domain_unreachable_or_dns_failed',
    error: lastError.message,
    html: typeof lastError.response?.data === 'string' ? lastError.response.data : '',
    responseTimeMs: 0,
    retriesAttempted: attempt - 1,
  };
}

/**
 * Extracts and cleans structural nodes according to the Anti-Weight Framework
 * Discards inline CSS, scripts, SVG paths, base64 images; budgets text under 50KB.
 */
function parseAndTriageHtml(html, normalizedUrl) {
  const parsedUrl = new URL(normalizedUrl);
  const $ = cheerio.load(html || '<html><head></head><body></body></html>');

  // Discard Protocol: Strip out inline CSS scripts, SVG path definitions, heavy JS bundles, iframes
  $('script, style, noscript, svg, iframe, canvas, link[rel="stylesheet"]').remove();

  // 1. Metadata Extraction
  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || 'Not Found';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'Not Found';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const author = $('meta[name="author"]').attr('content') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || 'Not Found';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || 'utf-8';
  const lang = $('html').attr('lang') || 'en';

  const ogData = {
    title: $('meta[property="og:title"]').attr('content') || title,
    description: $('meta[property="og:description"]').attr('content') || description,
    image: $('meta[property="og:image"]').attr('content') || '',
    url: $('meta[property="og:url"]').attr('content') || normalizedUrl,
    type: $('meta[property="og:type"]').attr('content') || 'website',
    siteName: $('meta[property="og:site_name"]').attr('content') || '',
  };

  const twitterData = {
    card: $('meta[name="twitter:card"]').attr('content') || '',
    title: $('meta[name="twitter:title"]').attr('content') || title,
    description: $('meta[name="twitter:description"]').attr('content') || description,
    image: $('meta[name="twitter:image"]').attr('content') || '',
  };

  // 2. Document Headings (h1 through h6)
  const headings = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  };

  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    $(tag).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text && text.length < 300) {
        headings[tag].push(text);
      }
    });
  });

  // 3. Primary CTAs (Buttons & links with action-oriented styling)
  const ctas = [];
  $('button, a.btn, a.button, a[class*="cta"], a[class*="btn"], input[type="submit"]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim() || $(el).attr('value') || '';
    if (text && text.length > 1 && text.length < 50 && !ctas.includes(text)) {
      ctas.push(text);
    }
  });

  // 4. Image Alt-Text Audit (Excludes heavy base64 embedded imagery)
  const images = [];
  const imagesMissingAlt = [];
  let totalImagesCount = 0;

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    // Skip inline base64 to avoid context weight bloat
    if (src.startsWith('data:image')) return;

    totalImagesCount++;
    const alt = $(el).attr('alt');
    const isMissingAlt = alt === undefined || alt === null || alt.trim() === '';

    let resolvedSrc = '';
    try {
      resolvedSrc = src.startsWith('http') ? src : (src ? new URL(src, normalizedUrl).href : '');
    } catch {
      resolvedSrc = src;
    }

    if (isMissingAlt) {
      imagesMissingAlt.push({ src: resolvedSrc || 'unknown' });
    }

    if (resolvedSrc && images.length < 25) {
      images.push({
        src: resolvedSrc,
        alt: alt || 'Not Found',
        missingAlt: isMissingAlt,
      });
    }
  });

  // 5. Internal / External / Social / Contact Links
  const internalLinks = new Set();
  const externalLinks = new Set();
  const socialLinks = [];
  const contactLinks = { emails: [], phones: [] };

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    if (href.startsWith('mailto:')) {
      const email = href.replace(/^mailto:/i, '').split('?')[0];
      if (email && !contactLinks.emails.includes(email)) contactLinks.emails.push(email);
      return;
    }
    if (href.startsWith('tel:')) {
      const phone = href.replace(/^tel:/i, '').split('?')[0];
      if (phone && !contactLinks.phones.includes(phone)) contactLinks.phones.push(phone);
      return;
    }

    try {
      const fullUrl = new URL(href, normalizedUrl);
      if (fullUrl.hostname === parsedUrl.hostname) {
        internalLinks.add(fullUrl.href);
      } else {
        externalLinks.add(fullUrl.href);
        const host = fullUrl.hostname.toLowerCase();
        if (host.includes('twitter.com') || host.includes('x.com')) socialLinks.push({ platform: 'X / Twitter', url: fullUrl.href });
        else if (host.includes('linkedin.com')) socialLinks.push({ platform: 'LinkedIn', url: fullUrl.href });
        else if (host.includes('facebook.com')) socialLinks.push({ platform: 'Facebook', url: fullUrl.href });
        else if (host.includes('instagram.com')) socialLinks.push({ platform: 'Instagram', url: fullUrl.href });
        else if (host.includes('youtube.com')) socialLinks.push({ platform: 'YouTube', url: fullUrl.href });
        else if (host.includes('github.com')) socialLinks.push({ platform: 'GitHub', url: fullUrl.href });
      }
    } catch {}
  });

  // 6. Forms audit
  const forms = [];
  $('form').each((_, el) => {
    const inputs = [];
    $(el).find('input, textarea, select').each((_, inputEl) => {
      inputs.push($(inputEl).attr('name') || $(inputEl).attr('type') || 'input');
    });
    forms.push({
      action: $(el).attr('action') || '',
      method: ($(el).attr('method') || 'GET').toUpperCase(),
      inputCount: inputs.length,
      fieldNames: inputs.slice(0, 10),
    });
  });

  // 7. Context Budgeting: Keep extracted text payload under 50KB per page
  let bodyText = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  const maxBytes = 48 * 1024; // 48KB threshold for safety under 50KB
  if (Buffer.byteLength(bodyText, 'utf8') > maxBytes) {
    bodyText = bodyText.slice(0, 24000);
  }

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    metadata: {
      title,
      description,
      keywords,
      author,
      robots,
      canonical,
      viewport,
      charset,
      lang,
    },
    openGraph: ogData,
    twitter: twitterData,
    headings,
    ctas: ctas.slice(0, 15),
    images: images.slice(0, 15),
    imagesMissingAlt,
    forms,
    contactLinks,
    socialLinks: socialLinks.slice(0, 10),
    internalLinks: Array.from(internalLinks),
    metrics: {
      wordCount,
      readingTimeMinutes,
      h1Count: headings.h1.length,
      h2Count: headings.h2.length,
      h3Count: headings.h3.length,
      totalImages: totalImagesCount,
      missingAltCount: imagesMissingAlt.length,
      internalLinksCount: internalLinks.size,
      externalLinksCount: externalLinks.size,
      formsCount: forms.length,
      ctasCount: ctas.length,
    },
    cleanTextSample: bodyText,
  };
}

/**
 * Crawls a single page with full Zero-G Error Deflection & Anti-Weight Triage
 */
async function crawlSinglePage(targetUrl) {
  const normalized = normalizeUrl(targetUrl);
  const fetchResult = await fetchWithResilience(normalized, 1);

  if (fetchResult.status === 'blocked') {
    return {
      url: normalized,
      statusCode: fetchResult.statusCode,
      responseTimeMs: fetchResult.responseTimeMs,
      isHttps: normalized.startsWith('https://'),
      blocked: true,
      cause: 'anti_scraping_wall',
      metadata: { title: 'Restricted Access', description: 'Anti-bot / Cloudflare wall encountered.' },
      openGraph: {},
      twitter: {},
      headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
      metrics: { wordCount: 0, readingTimeMinutes: 0, h1Count: 0, h2Count: 0, h3Count: 0, totalImages: 0, missingAltCount: 0, internalLinksCount: 0, externalLinksCount: 0, formsCount: 0, ctasCount: 0 },
      ctas: [],
      forms: [],
      contactLinks: { emails: [], phones: [] },
      socialLinks: [],
      images: [],
      internalLinks: [],
      textContentSample: '',
      fullTextLength: 0,
      system_diagnostics: {
        payload_size_kb: 0,
        retries_attempted: fetchResult.retriesAttempted,
      },
    };
  }

  const triaged = parseAndTriageHtml(fetchResult.html, normalized);
  const payloadSizeKb = parseFloat((Buffer.byteLength(triaged.cleanTextSample, 'utf8') / 1024).toFixed(2));

  return {
    url: normalized,
    statusCode: fetchResult.statusCode,
    responseTimeMs: fetchResult.responseTimeMs,
    isHttps: normalized.startsWith('https://'),
    metadata: triaged.metadata,
    openGraph: triaged.openGraph,
    twitter: triaged.twitter,
    headings: triaged.headings,
    metrics: triaged.metrics,
    ctas: triaged.ctas,
    forms: triaged.forms,
    contactLinks: triaged.contactLinks,
    socialLinks: triaged.socialLinks,
    images: triaged.images,
    internalLinks: triaged.internalLinks,
    textContentSample: triaged.cleanTextSample.slice(0, 6000),
    fullTextLength: triaged.cleanTextSample.length,
    system_diagnostics: {
      payload_size_kb: payloadSizeKb,
      retries_attempted: fetchResult.retriesAttempted,
    },
    // Standard Orchestration format
    crawl_meta: {
      target_url: normalized,
      execution_time_ms: fetchResult.responseTimeMs,
      status: fetchResult.status,
    },
    extracted_assets: {
      headings: triaged.headings,
      metadata: triaged.metadata,
      ctas: triaged.ctas,
      images_missing_alt: triaged.imagesMissingAlt,
    },
  };
}

/**
 * Crawl website multi-page orchestrator
 */
async function crawlWebsite(targetUrl, maxPages = 3) {
  const mainPage = await crawlSinglePage(targetUrl);
  const crawledPages = [mainPage];
  const visitedUrls = new Set([mainPage.url]);

  if (!mainPage.blocked && mainPage.internalLinks?.length > 0) {
    const priorityPatterns = ['/pricing', '/price', '/about', '/contact', '/services', '/features', '/faq'];
    const candidateUrls = mainPage.internalLinks.filter((link) => {
      try {
        const path = new URL(link).pathname.toLowerCase();
        return priorityPatterns.some((p) => path.includes(p)) && !visitedUrls.has(link);
      } catch {
        return false;
      }
    });

    for (const subUrl of candidateUrls.slice(0, maxPages - 1)) {
      try {
        visitedUrls.add(subUrl);
        const subPage = await crawlSinglePage(subUrl);
        crawledPages.push(subPage);
      } catch {}
    }
  }

  const combinedContent = crawledPages.map((p, idx) => `
--- PAGE ${idx + 1}: ${p.url} ---
Title: ${p.metadata?.title || 'Not Found'}
Meta Description: ${p.metadata?.description || 'Not Found'}
H1 Headings: ${p.headings?.h1?.join(' | ') || 'None'}
H2 Headings: ${p.headings?.h2?.slice(0, 6).join(' | ') || 'None'}
CTAs: ${p.ctas?.join(', ') || 'None'}
Main Content:
${p.textContentSample || ''}
`).join('\n\n');

  return {
    primaryUrl: mainPage.url,
    domain: new URL(mainPage.url).hostname,
    crawledAt: new Date().toISOString(),
    pagesCount: crawledPages.length,
    crawledPages,
    combinedContent,
    primaryPage: mainPage,
    crawl_meta: mainPage.crawl_meta,
    extracted_assets: mainPage.extracted_assets,
    system_diagnostics: mainPage.system_diagnostics,
  };
}

module.exports = {
  normalizeUrl,
  crawlSinglePage,
  crawlWebsite,
  parseAndTriageHtml,
};
