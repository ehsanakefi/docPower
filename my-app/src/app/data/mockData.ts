export interface Document {
  id: string;
  code: string;
  title: string;
  titlePersian: string;
  status: 'active' | 'obsolete';
  snippet: string;
  snippetPersian: string;
  articleCount: number;
  approvalDate: string;
  issuingBody: string;
  issuingBodyPersian: string;
  technicalDomain: string;
  technicalDomainPersian: string;
  keywords: string[];
}

export interface GISAsset {
  id: string;
  assetType: string;
  voltage: string;
  location: string;
  coordinates: string;
  installDate: string;
  status: string;
}

export interface ClimateParameter {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  region: string;
  dataSource: string;
  reliability: string;
}

export const mockDocuments: Document[] = [
  {
    id: '1',
    code: 'TAV112-02/00',
    title: 'Knowledge Management Directive',
    titlePersian: 'دستورالعمل مدیریت دانش',
    status: 'active',
    snippet: 'This directive establishes the framework for knowledge maturity assessment and documentation standards across power distribution networks...',
    snippetPersian: 'این دستورالعمل چارچوب ارزیابی بلوغ دانش و استانداردهای مستندسازی را در شبکه‌های توزیع برق تعیین می‌کند...',
    articleCount: 24,
    approvalDate: '1402/11/15',
    issuingBody: 'Tavanir Administrative Council',
    issuingBodyPersian: 'شورای اداری توانیر',
    technicalDomain: 'Knowledge Management',
    technicalDomainPersian: 'مدیریت دانش',
    keywords: ['knowledge maturity', 'documentation', 'standards'],
  },
  {
    id: '2',
    code: 'TAV203-15/01',
    title: 'GIS Asset Registry Specification',
    titlePersian: 'مشخصات ثبت دارایی‌های سیستم اطلاعات جغرافیایی',
    status: 'active',
    snippet: 'Comprehensive specification for geographic information system integration with power distribution asset management including coordinate systems...',
    snippetPersian: 'مشخصات جامع برای یکپارچه‌سازی سیستم اطلاعات جغرافیایی با مدیریت دارایی‌های توزیع برق شامل سیستم‌های مختصات...',
    articleCount: 18,
    approvalDate: '1402/09/22',
    issuingBody: 'Tavanir Technical Committee',
    issuingBodyPersian: 'کمیته فنی توانیر',
    technicalDomain: 'GIS',
    technicalDomainPersian: 'سیستم اطلاعات جغرافیایی',
    keywords: ['GIS', 'asset management', 'coordinates'],
  },
  {
    id: '3',
    code: 'TAV087-08/02',
    title: 'Climate Data Integration Protocol',
    titlePersian: 'پروتکل یکپارچه‌سازی داده‌های آب و هوایی',
    status: 'active',
    snippet: 'Guidelines for integrating meteorological data with load estimation models using Gumbel distribution for extreme weather events...',
    snippetPersian: 'راهنمای یکپارچه‌سازی داده‌های هواشناسی با مدل‌های تخمین بار با استفاده از توزیع گامبل برای رویدادهای آب و هوایی شدید...',
    articleCount: 32,
    approvalDate: '1402/08/10',
    issuingBody: 'Tavanir Research Division',
    issuingBodyPersian: 'بخش تحقیقات توانیر',
    technicalDomain: 'Climate',
    technicalDomainPersian: 'آب و هوا',
    keywords: ['climate', 'Gumbel distribution', 'load estimation'],
  },
  {
    id: '4',
    code: 'TAV156-12/00',
    title: 'Load Estimation Methodology',
    titlePersian: 'روش‌شناسی تخمین بار',
    status: 'active',
    snippet: 'Standard methodology for calculating coincidence factors and demand forecasting in residential and commercial sectors...',
    snippetPersian: 'روش‌شناسی استاندارد برای محاسبه ضرایب همزمانی و پیش‌بینی تقاضا در بخش‌های مسکونی و تجاری...',
    articleCount: 28,
    approvalDate: '1402/10/05',
    issuingBody: 'Tavanir',
    issuingBodyPersian: 'توانیر',
    technicalDomain: 'Load Estimation',
    technicalDomainPersian: 'تخمین بار',
    keywords: ['coincidence factor', 'demand forecasting', 'methodology'],
  },
  {
    id: '5',
    code: 'TAV089-03/01',
    title: 'Network Reliability Standards',
    titlePersian: 'استانداردهای قابلیت اطمینان شبکه',
    status: 'obsolete',
    snippet: 'Previous version of reliability standards, superseded by TAV089-04/00. Covers SAIDI, SAIFI, and CAIDI metrics...',
    snippetPersian: 'نسخه قبلی استانداردهای قابلیت اطمینان، جایگزین شده با TAV089-04/00. شاخص‌های SAIDI، SAIFI و CAIDI را پوشش می‌دهد...',
    articleCount: 15,
    approvalDate: '1400/06/18',
    issuingBody: 'Tavanir',
    issuingBodyPersian: 'توانیر',
    technicalDomain: 'Reliability',
    technicalDomainPersian: 'قابلیت اطمینان',
    keywords: ['reliability', 'SAIDI', 'SAIFI', 'obsolete'],
  },
];

export const mockGISAssets: GISAsset[] = [
  {
    id: 'A001',
    assetType: 'Transformer - 20/0.4 kV',
    voltage: '20 kV',
    location: 'Tehran District 5',
    coordinates: '35.7219, 51.3347',
    installDate: '1398/03/12',
    status: 'Operational',
  },
  {
    id: 'A002',
    assetType: 'Distribution Panel',
    voltage: '0.4 kV',
    location: 'Isfahan Zone 2',
    coordinates: '32.6546, 51.6680',
    installDate: '1399/07/20',
    status: 'Operational',
  },
  {
    id: 'A003',
    assetType: 'Circuit Breaker',
    voltage: '63 kV',
    location: 'Mashhad Substation 7',
    coordinates: '36.2974, 59.6059',
    installDate: '1397/11/08',
    status: 'Under Maintenance',
  },
  {
    id: 'A004',
    assetType: 'Transformer - 63/20 kV',
    voltage: '63 kV',
    location: 'Shiraz Grid Station',
    coordinates: '29.5918, 52.5836',
    installDate: '1401/02/15',
    status: 'Operational',
  },
];

export const mockClimateParameters: ClimateParameter[] = [
  {
    id: 'C001',
    parameter: 'Max Temperature (Summer)',
    value: 42.5,
    unit: '°C',
    region: 'Khuzestan',
    dataSource: 'IMO Weather Station',
    reliability: 'High',
  },
  {
    id: 'C002',
    parameter: 'Min Temperature (Winter)',
    value: -18.2,
    unit: '°C',
    region: 'Ardabil',
    dataSource: 'IMO Weather Station',
    reliability: 'High',
  },
  {
    id: 'C003',
    parameter: 'Annual Precipitation',
    value: 1825,
    unit: 'mm',
    region: 'Gilan',
    dataSource: 'Regional Meteorology',
    reliability: 'Medium',
  },
  {
    id: 'C004',
    parameter: 'Wind Speed (Avg)',
    value: 28.5,
    unit: 'km/h',
    region: 'Sistan',
    dataSource: 'IMO Weather Station',
    reliability: 'High',
  },
];

export const aiSuggestions = [
  'استانداردهای GIS',
  'ضرایب همزمانی بار',
  'توزیع گامبل',
  'TAV112',
  'مدیریت دانش',
];

export const aiChatHistory = [
  {
    role: 'user' as const,
    message: 'تعریف بلوغ دانش چیست؟',
  },
  {
    role: 'assistant' as const,
    message: 'بلوغ دانش به سطح توسعه‌یافتگی فرآیندها، سیستم‌ها و فرهنگ سازمانی در زمینه مدیریت، اشتراک‌گذاری و بهره‌برداری از دانش اشاره دارد. طبق دستورالعمل TAV112-02/00، پنج سطح بلوغ تعریف شده است: ابتدایی، مدیریت‌شده، تعریف‌شده، کمی‌شده و بهینه‌سازی‌شده.',
  },
];
