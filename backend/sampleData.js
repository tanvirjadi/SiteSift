const sampleAnalysisData = {
  targetUrl: 'https://example-saas-platform.com',
  domain: 'example-saas-platform.com',
  analyzedAt: new Date().toISOString(),
  speedMetrics: {
    status: 'success',
    source: 'Google PageSpeed Insights',
    performanceScore: 84,
    lcp: '1.9 s',
    cls: '0.02',
    fcp: '1.1 s',
    speedIndex: '2.1 s',
    totalBlockingTime: '120 ms',
    grade: 'Good'
  },
  crawl_meta: {
    target_url: 'https://example-saas-platform.com',
    execution_time_ms: 342,
    status: 'success'
  },
  system_diagnostics: {
    payload_size_kb: 14.2,
    retries_attempted: 0
  },
  crawlResult: {
    primaryUrl: 'https://example-saas-platform.com',
    domain: 'example-saas-platform.com',
    crawledAt: new Date().toISOString(),
    pagesCount: 3,
    crawl_meta: {
      target_url: 'https://example-saas-platform.com',
      execution_time_ms: 342,
      status: 'success'
    },
    system_diagnostics: {
      payload_size_kb: 14.2,
      retries_attempted: 0
    },
    primaryPage: {
      url: 'https://example-saas-platform.com',
      statusCode: 200,
      responseTimeMs: 342,
      isHttps: true,
      metadata: {
        title: 'Modern Analytics for Growing Teams | DataPulse',
        description: 'Empower your teams with real-time business intelligence and data visualization dashboards.',
        keywords: 'analytics, business intelligence, dashboards, team metrics',
        author: 'DataPulse Technologies Inc.',
        robots: 'index, follow',
        canonical: 'https://example-saas-platform.com',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'utf-8',
        lang: 'en',
      },
      openGraph: {
        title: 'Modern Analytics for Growing Teams | DataPulse',
        description: 'Empower your teams with real-time business intelligence.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        url: 'https://example-saas-platform.com',
        type: 'website',
        siteName: 'DataPulse',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Modern Analytics for Growing Teams | DataPulse',
        description: 'Empower your teams with real-time business intelligence.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      },
      headings: {
        h1: ['Transform Your Raw Data into Profitable Decisions in Minutes'],
        h2: [
          'Unified Metrics across 50+ integrations',
          'Self-Serve Reports Without SQL',
          'Enterprise Grade Security from Day One',
          'What Our 2,400+ Fast-Growing Customers Say',
          'Simple, Transparent Pricing with No Hidden Fees'
        ],
        h3: [
          'Automated Syncing',
          'AI-Powered Anomaly Alerts',
          'Role-Based Access Control',
          'SOC-2 Type II Certified'
        ],
        h4: [],
        h5: [],
        h6: []
      },
      metrics: {
        wordCount: 1420,
        readingTimeMinutes: 7,
        h1Count: 1,
        h2Count: 5,
        h3Count: 4,
        totalImages: 14,
        missingAltCount: 4,
        internalLinksCount: 18,
        externalLinksCount: 6,
        formsCount: 2,
        ctasCount: 5,
      },
      ctas: [
        'Start 14-Day Free Trial',
        'Book 1-on-1 Demo',
        'Calculate ROI',
        'Contact Sales',
        'View Documentation'
      ],
      forms: [
        {
          action: '/api/trial-signup',
          method: 'POST',
          inputCount: 4,
          fieldNames: ['fullName', 'workEmail', 'companySize', 'password']
        },
        {
          action: '/api/newsletter',
          method: 'POST',
          inputCount: 1,
          fieldNames: ['email']
        }
      ],
      contactLinks: {
        emails: ['support@datapulse.io', 'sales@datapulse.io'],
        phones: ['+1 (888) 492-3829']
      },
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/datapulse' },
        { platform: 'X / Twitter', url: 'https://x.com/datapulse_hq' },
        { platform: 'GitHub', url: 'https://github.com/datapulse-org' }
      ],
      textContentSample: 'Transform your raw company data into profitable decisions in minutes. Stop drowning in disconnected spreadsheets and complex BI software that requires a dedicated data science team. DataPulse connects seamlessly to Stripe, PostgreSQL, Salesforce, HubSpot, and Google Analytics...',
    },
    crawledPages: [
      {
        url: 'https://example-saas-platform.com',
        statusCode: 200,
        responseTimeMs: 342,
        isHttps: true,
        metadata: {
          title: 'Modern Analytics for Growing Teams | DataPulse',
          description: 'Empower your teams with real-time business intelligence and data visualization dashboards.',
        },
        headings: {
          h1: ['Transform Your Raw Data into Profitable Decisions in Minutes'],
          h2: ['Unified Metrics', 'Self-Serve Reports', 'Transparent Pricing'],
        },
        metrics: { wordCount: 1420, readingTimeMinutes: 7, totalImages: 14, missingAltCount: 4, formsCount: 2 },
        ctas: ['Start 14-Day Free Trial', 'Book 1-on-1 Demo']
      },
      {
        url: 'https://example-saas-platform.com/pricing',
        statusCode: 200,
        responseTimeMs: 290,
        isHttps: true,
        metadata: {
          title: 'Pricing Plans - Starter, Growth & Enterprise | DataPulse',
          description: 'Flexible pricing designed to scale with your team. 14-day free trial on all plans.',
        },
        headings: {
          h1: ['Predictable, Scalable Pricing for Modern Teams'],
          h2: ['Starter Plan $49/mo', 'Pro Plan $149/mo', 'Enterprise Custom'],
        },
        metrics: { wordCount: 890, readingTimeMinutes: 4, totalImages: 6, missingAltCount: 1, formsCount: 1 },
        ctas: ['Get Started with Pro', 'Contact Enterprise Sales']
      },
      {
        url: 'https://example-saas-platform.com/about',
        statusCode: 200,
        responseTimeMs: 315,
        isHttps: true,
        metadata: {
          title: 'About DataPulse - Our Mission and Story',
          description: 'Learn how DataPulse was founded to make high-end business intelligence accessible to every business.',
        },
        headings: {
          h1: ['We Believe Better Data Leads to Better Companies'],
          h2: ['Founded in 2022', 'Backed by Top Tier Investors', 'Leadership Team'],
        },
        metrics: { wordCount: 1100, readingTimeMinutes: 5, totalImages: 8, missingAltCount: 2, formsCount: 0 },
        ctas: ['Join Our Team', 'Read Our Blog']
      }
    ]
  },
  extractedBlueprint: {
    businessName: 'DataPulse Analytics',
    vertical: 'B2B SaaS',
    tagline: 'Transform raw data into profitable decisions without writing SQL',
    valueProposition: 'DataPulse provides an intuitive, no-code business intelligence platform that connects disparate company databases into real-time visual executive dashboards.',
    targetAudience: {
      profile: 'Growth-stage B2B SaaS founders, Product Managers, and Marketing Leads without dedicated in-house data engineers.',
      marketSegment: 'SMB and Mid-Market B2B'
    },
    coreOfferings: [
      '50+ One-Click Data Source Connectors (Stripe, HubSpot, Postgres)',
      'Automated Executive KPI Dashboards & Real-Time Alerts',
      'Natural Language AI Query Builder (Ask questions in plain English)',
      'Scheduled Slack & Email PDF Summary Reports'
    ],
    primaryConversionGoal: 'Drive signups for the 14-day self-serve free trial and qualify enterprise demo leads.',
    ctaInventory: [
      { text: 'Start 14-Day Free Trial', context: 'Hero section primary button' },
      { text: 'Book 1-on-1 Demo', context: 'Hero secondary & Enterprise page' },
      { text: 'Calculate ROI', context: 'Interactive calculator banner' },
      { text: 'Contact Sales', context: 'Pricing table custom tier' }
    ],
    pricingModel: 'Tiered Monthly/Annual SaaS Subscription ($49/mo, $149/mo, Custom Enterprise)',
    trustSignalsDetected: [
      'SOC-2 Type II Certification seal',
      '2,400+ Active customer count claim',
      'Logos from mid-market tech startups',
      'G2 High Performer badge'
    ],
    contentToneAndClarity: 'Professional, benefit-driven, approachable, modern product-led SaaS tone.',
    executiveSummary: 'DataPulse operates a well-structured SaaS website targeting non-technical operators. The messaging focuses on eliminating SQL complexity. While visual branding is strong, significant conversion leaks exist around the signup friction and ambiguous plan limits.'
  },
  auditResult: {
    siteHealthScore: 68,
    revenueRiskLevel: 'High',
    estimatedMonthlyBounceCost: 'High risk of losing 35-45% of potential paid trials due to signup form friction and missing social proof near checkout.',
    executiveSummary: 'Your website has strong visual appeal and a solid core value proposition. However, you are leaking paying customers at two critical junctures: First, your primary hero CTA forces users into a 4-field sign-up form before demonstrating any live product value. Second, your pricing page fails to answer critical buyer objections about data security and migration ease, driving high-intent visitors back to Google.',
    topQuickWins: [
      {
        title: 'Single-Click Google/GitHub SSO on Hero',
        impact: 'Estimated 22-30% increase in trial completions by eliminating password/company size barrier.',
        action: 'Replace the 4-field modal with 1-click Google Workspace login on the primary trial button.'
      },
      {
        title: 'Hero Risk-Reversal Microcopy',
        impact: 'Reduces hesitation for first-time visitors who fear unexpected credit card charges.',
        action: 'Add "No credit card required • Instant 2-minute setup • Cancel anytime" directly below the main trial button.'
      },
      {
        title: 'Objection-Busting FAQ directly on Pricing Table',
        impact: 'Plugs 15-20% bounce rate from users hesitating over data privacy and migration effort.',
        action: 'Add a collapsible 4-question FAQ addressing SOC-2 security, connector speed, and contract flexibility.'
      }
    ],
    criticalFlaws: [
      {
        id: 'CRIT-01',
        heuristic: 'Flexibility and efficiency of use / Friction reduction',
        issue: 'Premature 4-Field Signup Form Causes 40%+ Trial Abandonment',
        location: 'Above-the-fold Hero & Trial Modal',
        conversionImpact: 'Visitors interested in seeing the product are immediately greeted with form fields asking for company size and password before experiencing any product magic. This friction causes high-intent visitors to bounce.',
        actionableFix: 'Implement 1-click "Continue with Google" auth or ask for Work Email only on step 1.',
        effort: 'Quick Win (<1h)'
      },
      {
        id: 'CRIT-02',
        heuristic: 'Recognition rather than recall / Social proof proof points',
        issue: 'Social Proof Is Buried Below 3 Full Screens of Scroll',
        location: 'Hero Section / First Screen',
        conversionImpact: 'Only ~30% of web visitors scroll past the first screen. Because client logos are located near the bottom, 70% of potential buyers never see evidence that other businesses trust your software.',
        actionableFix: 'Move a concise social proof bar ("Trusted by 2,400+ teams at [Logo 1] [Logo 2] [Logo 3]") directly underneath the Hero headline.',
        effort: 'Quick Win (<1h)'
      }
    ],
    optimizationOpportunities: [
      {
        id: 'OPT-01',
        issue: 'Ambiguous Row & Sync Limits on the $49/mo Starter Plan',
        location: 'Pricing Page (/pricing)',
        conversionImpact: 'Prospects evaluating Starter vs Pro plan cannot tell how many rows of data are included, creating buying hesitation.',
        actionableFix: 'Add explicit limits ("Up to 500k rows/mo • 1-hour sync intervals • 3 seats") with tooltip assistance.',
        effort: 'Moderate (1-2 days)'
      },
      {
        id: 'OPT-02',
        issue: '4 Images Missing Descriptive Alt Tags',
        location: 'Feature Grid',
        conversionImpact: 'Hurts accessibility and organic image search indexability.',
        actionableFix: 'Add semantic alt attributes describing dashboard charts.',
        effort: 'Quick Win (<1h)'
      }
    ],
    weaknesses: [
      {
        id: 'WEAK-01',
        category: 'Call-To-Action & Friction',
        severity: 'Critical',
        issue: 'Premature 4-Field Signup Form Causes 40%+ Trial Abandonment',
        dropoffLocation: 'Above-the-fold Hero & Trial Modal',
        customerCost: 'Visitors interested in seeing the product are immediately greeted with form fields asking for company size and password before experiencing any product magic. This psychological friction causes high-intent visitors to bounce and compare easier competitors.',
        actionableFix: 'Implement 1-click "Continue with Google" auth or ask for Work Email only on step 1. Introduce an interactive sandbox or 30-second interactive preview video above the fold.',
        effort: 'Quick Win (<1h)'
      },
      {
        id: 'WEAK-02',
        category: 'Trust & Social Proof',
        severity: 'High',
        issue: 'Social Proof Is Buried Below 3 Full Screens of Scroll',
        dropoffLocation: 'Hero Section / First Screen',
        customerCost: 'Only ~30% of web visitors scroll past the first screen. Because client logos and customer quotes are located at the bottom of the page, 70% of potential buyers never see evidence that other businesses trust your software.',
        actionableFix: 'Move a concise social proof bar ("Trusted by 2,400+ teams at [Logo 1] [Logo 2] [Logo 3]") directly underneath the Hero headline and CTA.',
        effort: 'Quick Win (<1h)'
      },
      {
        id: 'WEAK-03',
        category: 'Pricing & Objections',
        severity: 'High',
        issue: 'Ambiguous Row & Sync Limits on the $49/mo Starter Plan',
        dropoffLocation: 'Pricing Page (/pricing)',
        customerCost: 'Prospects evaluating the Starter vs Pro plan cannot tell how many rows of data or sync frequencies are included. Uncertainty creates hesitation, and hesitant buyers delay their purchase or seek alternatives.',
        actionableFix: 'Add explicit limits (e.g., "Up to 500k rows/mo • 1-hour sync intervals • 3 team seats") with an interactive tooltip explaining what typical company size fits each tier.',
        effort: 'Moderate (1-2 days)'
      },
      {
        id: 'WEAK-04',
        category: 'Value Proposition & Clarity',
        severity: 'Medium',
        issue: 'Headline Focuses on General "Data" Instead of Specific Business ROI',
        dropoffLocation: 'Hero H1 Banner',
        customerCost: 'The H1 "Transform Your Raw Data into Profitable Decisions" is generic. Visitors don\'t immediately see whether this is for eCommerce, SaaS, or logistics, leading to longer cognitive load before they engage.',
        actionableFix: 'Test a benefit-first headline: "Automated Executive Dashboards for B2B SaaS — Sync Stripe & Postgres in 3 Minutes Without SQL".',
        effort: 'Quick Win (<1h)'
      },
      {
        id: 'WEAK-05',
        category: 'Mobile & UX Friction',
        severity: 'Medium',
        issue: '4 Images Missing Descriptive Alt Tags & Heavy Desktop-Only Tables',
        dropoffLocation: 'Feature Grid & Mobile Screens',
        customerCost: 'Screen reader accessibility is impaired, hurting organic search ranking algorithms. On mobile screens, the feature comparison table requires horizontal scrolling which causes high mobile bounce rates.',
        actionableFix: 'Add semantic alt attributes describing dashboard charts (e.g. "Real-time MRR and churn dashboard chart"). Convert mobile pricing into vertical swipeable cards.',
        effort: 'Moderate (1-2 days)'
      },
      {
        id: 'WEAK-06',
        category: 'SEO & Snippet Appeal',
        severity: 'Low',
        issue: 'Meta Description Exceeds Recommended 160 Characters & Lacks Enticing Hook',
        dropoffLocation: 'Google Search Engine Results Page (SERP)',
        customerCost: 'Search engines truncate the end of your snippet, reducing Google SERP click-through rate against competitors with punchier titles.',
        actionableFix: 'Shorten meta description to 148 characters: "Turn company data into real-time executive dashboards without SQL. Connect Stripe, HubSpot & Postgres in 2 mins. Start your 14-day free trial."',
        effort: 'Quick Win (<1h)'
      }
    ],
    strengths: [
      'Sub-400ms server response time provides snappy initial page load feel',
      'Valid HTTPS and responsive viewport configuration across devices',
      'Clean single H1 tag hierarchy on the landing page',
      'Clear, readable typography with strong contrast ratios'
    ],
    passedElements: [
      'Sub-400ms server response time provides snappy initial page load feel',
      'Valid HTTPS and responsive viewport configuration across devices',
      'Clean single H1 tag hierarchy on the landing page',
      'Clear, readable typography with strong contrast ratios'
    ]
  }
};

module.exports = {
  sampleAnalysisData,
};
