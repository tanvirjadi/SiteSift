const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SiteSift/1.0';

function normalizeUrl(rawUrl) {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

async function crawlSinglePage(targetUrl) {
  const startTime = Date.now();
  const normalized = normalizeUrl(targetUrl);
  const parsedUrl = new URL(normalized);

  const response = await axios.get(normalized, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: (status) => status < 500,
  });

  const responseTimeMs = Date.now() - startTime;
  const html = response.data;
  if (typeof html !== 'string') {
    throw new Error('Received non-HTML response from target website');
  }

  const $ = cheerio.load(html);

  $('script, style, noscript, svg, iframe, canvas').remove();

  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const author = $('meta[name="author"]').attr('content') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || 'utf-8';
  const lang = $('html').attr('lang') || '';

  const ogData = {
    title: $('meta[property="og:title"]').attr('content') || '',
    description: $('meta[property="og:description"]').attr('content') || '',
    image: $('meta[property="og:image"]').attr('content') || '',
    url: $('meta[property="og:url"]').attr('content') || '',
    type: $('meta[property="og:type"]').attr('content') || '',
    siteName: $('meta[property="og:site_name"]').attr('content') || '',
  };

  const twitterData = {
    card: $('meta[name="twitter:card"]').attr('content') || '',
    title: $('meta[name="twitter:title"]').attr('content') || '',
    description: $('meta[name="twitter:description"]').attr('content') || '',
    image: $('meta[name="twitter:image"]').attr('content') || '',
  };

  const headings = {
    h1: [],
    h2: [],
    h3: [],
  };
  $('h1').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) headings.h1.push(text);
  });
  $('h2').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) headings.h2.push(text);
  });
  $('h3').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) headings.h3.push(text);
  });

  const images = [];
  let missingAltCount = 0;
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    const alt = $(el).attr('alt');
    const isMissingAlt = alt === undefined || alt === null || alt.trim() === '';
    if (isMissingAlt) missingAltCount++;
    if (src && images.length < 25) {
      images.push({
        src: src.startsWith('http') ? src : new URL(src, normalized).href,
        alt: alt || '',
        missingAlt: isMissingAlt,
      });
    }
  });

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
      const fullUrl = new URL(href, normalized);
      const isInternal = fullUrl.hostname === parsedUrl.hostname;
      if (isInternal) {
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

  const ctas = [];
  $('button, a.btn, a.button, a[class*="cta"], a[class*="btn"], input[type="submit"]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim() || $(el).attr('value') || '';
    if (text && text.length < 50 && !ctas.includes(text)) {
      ctas.push(text);
    }
  });

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

  const bodyText = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    url: normalized,
    statusCode: response.status,
    responseTimeMs,
    isHttps: normalized.startsWith('https://'),
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
    metrics: {
      wordCount,
      readingTimeMinutes,
      h1Count: headings.h1.length,
      h2Count: headings.h2.length,
      h3Count: headings.h3.length,
      totalImages: $('img').length,
      missingAltCount,
      internalLinksCount: internalLinks.size,
      externalLinksCount: externalLinks.size,
      formsCount: forms.length,
      ctasCount: ctas.length,
    },
    ctas: ctas.slice(0, 15),
    forms,
    contactLinks,
    socialLinks: socialLinks.slice(0, 10),
    images: images.slice(0, 15),
    internalLinks: Array.from(internalLinks),
    textContentSample: bodyText.slice(0, 6000),
    fullTextLength: bodyText.length,
  };
}

async function crawlWebsite(targetUrl, maxPages = 3) {
  const mainPage = await crawlSinglePage(targetUrl);
  const crawledPages = [mainPage];
  const visitedUrls = new Set([mainPage.url]);

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

  const combinedContent = crawledPages.map((p, idx) => `
--- PAGE ${idx + 1}: ${p.url} ---
Title: ${p.metadata.title}
Meta Description: ${p.metadata.description}
H1 Headings: ${p.headings.h1.join(' | ') || 'None'}
H2 Headings: ${p.headings.h2.slice(0, 6).join(' | ') || 'None'}
CTAs: ${p.ctas.join(', ') || 'None'}
Main Content:
${p.textContentSample}
`).join('\n\n');

  return {
    primaryUrl: mainPage.url,
    domain: new URL(mainPage.url).hostname,
    crawledAt: new Date().toISOString(),
    pagesCount: crawledPages.length,
    crawledPages,
    combinedContent,
    primaryPage: mainPage,
  };
}

module.exports = {
  normalizeUrl,
  crawlSinglePage,
  crawlWebsite,
};
