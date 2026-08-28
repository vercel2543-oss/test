import { Award, DriveFolder, AcademicYear, SchoolSettings, DepartmentType, AwardLevelType } from '../types';

export const DEPARTMENTS: {
  id: DepartmentType;
  nameTh: string;
  nameEn: string;
  code: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}[] = [
  {
    id: 'academic',
    nameTh: 'ฝ่ายวิชาการ',
    nameEn: 'Academic Affairs',
    code: '01_วิชาการ',
    color: '#2563eb',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    description: 'ผลงานการแข่งขันทักษะวิชาการ โอลิมปิกวิชาการ งานวิจัย นวัตกรรมการสอน และการสอบวัดระดับ'
  },
  {
    id: 'affairs',
    nameTh: 'ฝ่ายกิจการ',
    nameEn: 'Student Affairs',
    code: '02_กิจการ',
    color: '#059669',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-600',
    description: 'ผลงานด้านกีฬา ดนตรี ศิลปวัฒนธรรม สภานักเรียน จิตอาสา และกิจกรรมพัฒนาผู้เรียน'
  },
  {
    id: 'general',
    nameTh: 'ฝ่ายทั่วไปโรงเรียน',
    nameEn: 'General Administration',
    code: '03_ทั่วไปโรงเรียน',
    color: '#d97706',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    description: 'รางวัลมาตรฐานสถานศึกษา อาคารสถานที่ สิ่งแวดล้อม ความปลอดภัย และระบบสารสนเทศ'
  },
  {
    id: 'personnel',
    nameTh: 'ฝ่ายบุคคล',
    nameEn: 'Human Resources',
    code: '04_บุคคล',
    color: '#7c3aed',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    description: 'รางวัลครูดีเด่น ครูผู้ทรงคุณค่า รางวัลคุรุสภา วิทยฐานะ และการเชิดชูเกียรติบุคลากร'
  },
  {
    id: 'budget',
    nameTh: 'ฝ่ายงบประมาณ',
    nameEn: 'Budget & Planning',
    code: '05_งบประมาณ',
    color: '#e11d48',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600',
    description: 'รางวัลการบริหารจัดการงบประมาณโปร่งใส การประเมิน ITA และแผนงานพัฒนาสถานศึกษา'
  }
];

export const AWARD_LEVELS: {
  id: AwardLevelType;
  nameTh: string;
  nameEn: string;
  badgeClass: string;
  gradientClass: string;
  rank: number;
  iconName: string;
}[] = [
  {
    id: 'international',
    nameTh: 'ระดับนานาชาติ',
    nameEn: 'International',
    badgeClass: 'bg-amber-500 text-white font-medium shadow-sm',
    gradientClass: 'from-amber-500 via-purple-600 to-indigo-700',
    rank: 1,
    iconName: 'Globe'
  },
  {
    id: 'national',
    nameTh: 'ระดับชาติ',
    nameEn: 'National',
    badgeClass: 'bg-yellow-500 text-slate-900 font-semibold shadow-sm',
    gradientClass: 'from-yellow-400 to-amber-600',
    rank: 2,
    iconName: 'Trophy'
  },
  {
    id: 'regional',
    nameTh: 'ระดับภาค / ภูมิภาค',
    nameEn: 'Regional',
    badgeClass: 'bg-sky-600 text-white font-medium',
    gradientClass: 'from-sky-500 to-blue-700',
    rank: 3,
    iconName: 'Medal'
  },
  {
    id: 'provincial',
    nameTh: 'ระดับจังหวัด',
    nameEn: 'Provincial',
    badgeClass: 'bg-emerald-600 text-white font-medium',
    gradientClass: 'from-emerald-500 to-teal-700',
    rank: 4,
    iconName: 'Award'
  },
  {
    id: 'area',
    nameTh: 'ระดับเขตพื้นที่ / สหวิทยาเขต',
    nameEn: 'Educational Area',
    badgeClass: 'bg-indigo-600 text-white font-medium',
    gradientClass: 'from-indigo-500 to-violet-700',
    rank: 5,
    iconName: 'Sparkles'
  },
  {
    id: 'school',
    nameTh: 'ระดับภายในสถานศึกษา',
    nameEn: 'School Level',
    badgeClass: 'bg-slate-700 text-white font-medium',
    gradientClass: 'from-slate-600 to-zinc-800',
    rank: 6,
    iconName: 'Bookmark'
  }
];

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolNameTh: 'โรงเรียนสาธิตวิทยาคม นวัตกรรมการเรียนรู้',
  schoolNameEn: 'Satit Wittayakom Demonstration School',
  schoolLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  schoolMotto: 'ปัญญาประเสริฐ นวัตกรรมล้ำเลิศ คุณธรรมนำใจ สู่ความเป็นเลิศสากล',
  requireApproval: true,
  allowPublicDownload: true,
  currentAcademicYear: '2569',
  driveRootFolderId: '1School_Root_Folder_Drive_ID_2026',
  driveRootFolderName: '📁 ผลงานและรางวัลโรงเรียน',
  driveRootFolderUrl: 'https://drive.google.com/drive/folders/1School_Root_Folder_Drive_ID_2026',
  folderStructureType: 'dept_year_type',
  contactEmail: 'achievement@satitwittaya.ac.th',
  contactPhone: '02-555-0199 ต่อ 102 (ฝ่ายสารสนเทศผลงาน)',
  facebookUrl: 'https://facebook.com/SatitWittayakomSchool',
  lineUrl: 'https://line.me/R/ti/p/@satitwittaya',
  websiteUrl: 'https://www.satitwittaya.ac.th',
  updatedAt: new Date().toISOString()
};

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: '2569', year: '2569', isCurrent: true, hasDriveFolders: true, createdAt: '2026-05-15T00:00:00Z', awardCount: 18 },
  { id: '2568', year: '2568', isCurrent: false, hasDriveFolders: true, createdAt: '2025-05-15T00:00:00Z', awardCount: 34 },
  { id: '2567', year: '2567', isCurrent: false, hasDriveFolders: true, createdAt: '2024-05-15T00:00:00Z', awardCount: 29 },
  { id: '2566', year: '2566', isCurrent: false, hasDriveFolders: true, createdAt: '2023-05-15T00:00:00Z', awardCount: 22 }
];

export const INITIAL_AWARDS: Award[] = [
  {
    id: 'award-001',
    awardName: 'รางวัลชนะเลิศเหรียญทอง การแข่งขันหุ่นยนต์และปัญญาประดิษฐ์ระดับนานาชาติ (International AI & Robotics Olympiad 2026)',
    recipientName: 'นายกิตติภูมิ ธนปภากุล และ ทีม AI Innovators',
    recipientType: 'team',
    recipientId: 'STU-65012',
    department: 'academic',
    level: 'international',
    academicYear: '2569',
    awardDate: '2026-07-18',
    organization: 'World Robot Olympiad & International AI Foundation ณ ประเทศญี่ปุ่น',
    description: 'พัฒนาหุ่นยนต์อัตโนมัติคัดแยกขยะชีวภาพด้วย Computer Vision และ Edge AI สามารถคัดแยกขยะได้อย่างแม่นยำ 99.4% สร้างชื่อเสียงเกียรติภูมิให้แก่ประเทศไทยและสถานศึกษา',
    certificate: {
      fileId: 'cert_drive_ai_wro_2026_01',
      fileName: 'Certificate_Gold_International_Robotics_2026.pdf',
      url: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 2450000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 01_วิชาการ / 2569 / เกียรติบัตร'
    },
    images: [
      {
        id: 'img-1',
        fileId: 'drive_img_001_1',
        fileName: 'team_award_ceremony.jpg',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80',
        order: 1,
        caption: 'ทีมนักเรียนขึ้นรับเหรียญทองและโล่เกียรติยศบนเวทีนานาชาติ'
      },
      {
        id: 'img-2',
        fileId: 'drive_img_001_2',
        fileName: 'robot_demonstration.jpg',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80',
        order: 2,
        caption: 'การสาธิตการทำงานของหุ่นยนต์ AI ต่อหน้าคณะกรรมการสากล'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: true,
    views: 1420,
    likes: 88,
    deleted: false,
    createdBy: 'admin_academic',
    createdByName: 'ครูดาวใจ สอนดี (หัวหน้าฝ่ายวิชาการ)',
    createdAt: '2026-07-20T10:30:00Z',
    updatedAt: '2026-07-21T08:15:00Z',
    googleDriveFolderId: 'folder_acad_2569_cert'
  },
  {
    id: 'award-002',
    awardName: 'รางวัลชนะเลิศถ้วยพระราชทาน การแข่งขันวงโยธวาทิตและดนตรีสากลระดับชาติ ครั้งที่ 42',
    recipientName: 'วงดุริยางค์เยาวชน Satit Symphonic Band',
    recipientType: 'team',
    recipientId: 'BAND-2026',
    department: 'affairs',
    level: 'national',
    academicYear: '2569',
    awardDate: '2026-06-12',
    organization: 'กรมพลศึกษา กระทรวงการท่องเที่ยวและกีฬา ร่วมกับ สมาคมดนตรีแห่งประเทศไทย',
    description: 'การประกวดวงโยธวาทิตชิงถ้วยพระราชทาน ประเภทคอนเสิร์ตและมาร์ชชิ่ง ได้รับคะแนนสูงสุดยอดเยี่ยม 98.6 คะแนน พร้อมรางวัลวาทยกรยอดเยี่ยม',
    certificate: {
      fileId: 'cert_drive_music_2026',
      fileName: 'Royal_Trophy_Symphonic_Band_2026.jpg',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 3100000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 02_กิจการ / 2569 / เกียรติบัตร'
    },
    images: [
      {
        id: 'img-201',
        fileId: 'img_band_stage',
        fileName: 'band_performance.jpg',
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
        order: 1,
        caption: 'การบรรเลงบทเพลงพระราชทานบนเวทีหอประชุมใหญ่'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: true,
    views: 954,
    likes: 62,
    deleted: false,
    createdBy: 'admin_affairs',
    createdByName: 'ครูพงษ์ศักดิ์ รักษ์ศิลป์ (ฝ่ายกิจการนักเรียน)',
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-16T11:00:00Z',
    googleDriveFolderId: 'folder_affairs_2569_cert'
  },
  {
    id: 'award-003',
    awardName: 'รางวัลคุรุสภา ระดับดีเด่น ประจำปี 2569 ประเภทผู้ประกอบวิชาชีพครูวิทยาศาสตร์และเทคโนโลยี',
    recipientName: 'ดร.สมชาย วิชชาญณรงค์',
    recipientType: 'teacher',
    recipientId: 'TCH-4402',
    department: 'personnel',
    level: 'national',
    academicYear: '2569',
    awardDate: '2026-05-28',
    organization: 'สำนักงานเลขาธิการคุรุสภา',
    description: 'ผลงานดีเด่นด้านการพัฒนานวัตกรรมการเรียนรู้ STEM + AI สำหรับเยาวชน และการสร้างเครือข่ายครูผู้นำการเปลี่ยนแปลงในระดับประเทศ',
    certificate: {
      fileId: 'cert_krusapa_dr_somchai',
      fileName: 'Certificate_Khurusapa_Distinguished_2026.pdf',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      mimeType: 'application/pdf',
      fileSize: 1840000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 04_บุคคล / 2569 / เกียรติบัตร'
    },
    images: [
      {
        id: 'img-301',
        fileId: 'img_krusapa_ceremony',
        fileName: 'dr_somchai_award.jpg',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&auto=format&fit=crop&q=80',
        order: 1,
        caption: 'พิธีมอบรางวัลเข็มเชิดชูเกียรติคุรุสภา'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: true,
    views: 830,
    likes: 45,
    deleted: false,
    createdBy: 'admin_personnel',
    createdByName: 'นางสุภาภรณ์ ทรัพย์เจริญ (ฝ่ายบุคคล)',
    createdAt: '2026-05-30T14:20:00Z',
    updatedAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 'award-004',
    awardName: 'รางวัลสถานศึกษาสีเขียวระดับยอดเยี่ยม (Eco-School Excellence Award) และโรงเรียนคาร์บอนต่ำ',
    recipientName: 'คณะผู้บริหารและคณะกรรมการสิ่งแวดล้อมโรงเรียน',
    recipientType: 'school',
    recipientId: 'SCH-GEN-01',
    department: 'general',
    level: 'national',
    academicYear: '2569',
    awardDate: '2026-06-05',
    organization: 'กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม',
    description: 'การบริหารจัดการพลังงานสะอาด โซลาร์รูฟท็อป ระบบคัดแยกขยะรีไซเคิล 100% และพื้นที่สีเขียวเพื่อการเรียนรู้เชิงนิเวศน์',
    certificate: {
      fileId: 'cert_eco_school_2026',
      fileName: 'EcoSchool_National_Excellence_2026.pdf',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 2200000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 03_ทั่วไปโรงเรียน / 2569 / เกียรติบัตร'
    },
    images: [
      {
        id: 'img-401',
        fileId: 'img_green_school',
        fileName: 'green_school_campus.jpg',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80',
        order: 1,
        caption: 'ภูมิทัศน์และศูนย์การเรียนรู้พลังงานแสงอาทิตย์ภายในโรงเรียน'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: false,
    views: 520,
    likes: 29,
    deleted: false,
    createdBy: 'admin_general',
    createdByName: 'นายอนุชา บริหารดี (ฝ่ายทั่วไป)',
    createdAt: '2026-06-08T11:00:00Z',
    updatedAt: '2026-06-08T11:00:00Z'
  },
  {
    id: 'award-005',
    awardName: 'รางวัลองค์กรโปร่งใสและการบริหารงบประมาณยอดเยี่ยม (ITA Award ระดับ AA คะแนน 99.12)',
    recipientName: 'ฝ่ายแผนงานและบริหารงบประมาณ',
    recipientType: 'school',
    recipientId: 'SCH-BUD-01',
    department: 'budget',
    level: 'national',
    academicYear: '2569',
    awardDate: '2026-07-02',
    organization: 'สำนักงานคณะกรรมการป้องกันและปราบปรามการทุจริตแห่งชาติ (ป.ป.ช.)',
    description: 'ผลการประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ (ITA) ประจำปีงบประมาณ 2569 ระดับผลการประเมิน AA คะแนนสูงสุดในสังกัด',
    certificate: {
      fileId: 'cert_ita_2026_aa',
      fileName: 'ITA_Award_Score_99_12_2026.pdf',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 1980000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 05_งบประมาณ / 2569 / เกียรติบัตร'
    },
    images: [],
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: false,
    views: 410,
    likes: 19,
    deleted: false,
    createdBy: 'admin_budget',
    createdByName: 'นางนภาพร การเงินมั่นคง (ฝ่ายงบประมาณ)',
    createdAt: '2026-07-05T13:00:00Z',
    updatedAt: '2026-07-05T13:00:00Z'
  },
  {
    id: 'award-006',
    awardName: 'รางวัลชนะเลิศอันดับ 1 การแข่งขันกล่าวสุนทรพจน์ภาษาอังกฤษระดับภูมิภาคเอเชียตะวันออกเฉียงใต้',
    recipientName: 'นางสาวพิมพ์ชนก รัตนสุวรรณ',
    recipientType: 'student',
    recipientId: 'STU-66045',
    department: 'academic',
    level: 'international',
    academicYear: '2568',
    awardDate: '2025-11-20',
    organization: 'ASEAN Youth English Public Speaking Guild ณ ประเทศสิงคโปร์',
    description: 'หัวข้อ "Youth Driving Sustainable Futures in the Digital Era" ชนะเลิศการแข่งขันจากผู้แทน 10 ประเทศสมาชิกอาเซียน',
    certificate: {
      fileId: 'cert_asean_english_2025',
      fileName: 'ASEAN_Speech_Champion_2025.jpg',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 2650000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 01_วิชาการ / 2568 / เกียรติบัตร'
    },
    images: [],
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: true,
    views: 1180,
    likes: 74,
    deleted: false,
    createdBy: 'admin_academic',
    createdByName: 'ครูดาวใจ สอนดี (หัวหน้าฝ่ายวิชาการ)',
    createdAt: '2025-11-25T15:00:00Z',
    updatedAt: '2025-11-25T15:00:00Z'
  },
  {
    id: 'award-007',
    awardName: 'เหรียญทอง การแข่งขันกีฬาว่ายน้ำเยาวชนชิงชนะเลิศแห่งประเทศไทย (ท่าฟรีสไตล์ 100 เมตร)',
    recipientName: 'นายธนพล สุขสวัสดิ์',
    recipientType: 'student',
    recipientId: 'STU-67089',
    department: 'affairs',
    level: 'national',
    academicYear: '2568',
    awardDate: '2025-10-14',
    organization: 'สมาคมกีฬาว่ายน้ำแห่งประเทศไทย ร่วมกับการกีฬาแห่งประเทศไทย',
    description: 'ทำสถิติเวลา 51.24 วินาที ทำลายสถิติกีฬาเยาวชนแห่งชาติ และผ่านการคัดเลือกเป็นตัวแทนเยาวชนทีมชาติไทย',
    certificate: {
      fileId: 'cert_swim_national_2025',
      fileName: 'Swimming_Gold_National_2025.jpg',
      url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=80',
      mimeType: 'image/jpeg',
      fileSize: 2100000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 02_กิจการ / 2568 / เกียรติบัตร'
    },
    images: [],
    coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: false,
    views: 670,
    likes: 38,
    deleted: false,
    createdBy: 'admin_affairs',
    createdByName: 'ครูพงษ์ศักดิ์ รักษ์ศิลป์ (ฝ่ายกิจการนักเรียน)',
    createdAt: '2025-10-16T10:00:00Z',
    updatedAt: '2025-10-16T10:00:00Z'
  },
  {
    id: 'award-008',
    awardName: 'รางวัลชนะเลิศการประกวดสื่อนวัตกรรมการสอนดิจิทัล ระดับภาคกลางและภาคตะวันออก',
    recipientName: 'นางสาวจินตนา ภักดีธรรม',
    recipientType: 'teacher',
    recipientId: 'TCH-5510',
    department: 'personnel',
    level: 'regional',
    academicYear: '2568',
    awardDate: '2025-08-30',
    organization: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา และสถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี',
    description: 'ผลงาน "Interactive Chemistry Laboratory Simulator" แพลตฟอร์มจำลองการทดลองเคมีเสมือนจริงแบบ 3 มิติสำหรับนักเรียนมัธยมปลาย',
    certificate: {
      fileId: 'cert_chem_sim_2025',
      fileName: 'Innovation_Teaching_Award_2025.pdf',
      url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&auto=format&fit=crop&q=80',
      mimeType: 'application/pdf',
      fileSize: 1750000,
      drivePath: '📁 ผลงานและรางวัลโรงเรียน / 04_บุคคล / 2568 / เกียรติบัตร'
    },
    images: [],
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    featured: false,
    views: 480,
    likes: 31,
    deleted: false,
    createdBy: 'admin_personnel',
    createdByName: 'นางสุภาภรณ์ ทรัพย์เจริญ (ฝ่ายบุคคล)',
    createdAt: '2025-09-02T11:30:00Z',
    updatedAt: '2025-09-02T11:30:00Z'
  }
];

export const INITIAL_DRIVE_FOLDERS: DriveFolder[] = [
  {
    id: 'root-folder-0',
    name: '📁 ผลงานและรางวัลโรงเรียน',
    type: 'root',
    department: 'all',
    parentFolderId: null,
    googleDriveFolderId: '1School_Root_Folder_Drive_ID_2026',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1School_Root_Folder_Drive_ID_2026',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 5
  },
  // 5 Departments
  {
    id: 'dept-folder-acad',
    name: '📁 01_วิชาการ',
    type: 'department',
    department: 'academic',
    parentFolderId: 'root-folder-0',
    googleDriveFolderId: '1_Dept_01_Academic_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Dept_01_Academic_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 4
  },
  {
    id: 'dept-folder-affairs',
    name: '📁 02_กิจการ',
    type: 'department',
    department: 'affairs',
    parentFolderId: 'root-folder-0',
    googleDriveFolderId: '1_Dept_02_Affairs_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Dept_02_Affairs_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 4
  },
  {
    id: 'dept-folder-general',
    name: '📁 03_ทั่วไปโรงเรียน',
    type: 'department',
    department: 'general',
    parentFolderId: 'root-folder-0',
    googleDriveFolderId: '1_Dept_03_General_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Dept_03_General_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 4
  },
  {
    id: 'dept-folder-personnel',
    name: '📁 04_บุคคล',
    type: 'department',
    department: 'personnel',
    parentFolderId: 'root-folder-0',
    googleDriveFolderId: '1_Dept_04_Personnel_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Dept_04_Personnel_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 4
  },
  {
    id: 'dept-folder-budget',
    name: '📁 05_งบประมาณ',
    type: 'department',
    department: 'budget',
    parentFolderId: 'root-folder-0',
    googleDriveFolderId: '1_Dept_05_Budget_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Dept_05_Budget_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 4
  },
  // Academic 2569
  {
    id: 'acad-2569-year',
    name: '📁 2569',
    type: 'year',
    department: 'academic',
    academicYear: '2569',
    parentFolderId: 'dept-folder-acad',
    googleDriveFolderId: '1_Acad_2569_Drive_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Acad_2569_Drive_ID',
    status: 'connected',
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 2
  },
  {
    id: 'acad-2569-cert',
    name: '📁 เกียรติบัตร',
    type: 'category',
    department: 'academic',
    academicYear: '2569',
    folderCategory: 'certificate',
    parentFolderId: 'acad-2569-year',
    googleDriveFolderId: '1_Acad_2569_Cert_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Acad_2569_Cert_ID',
    status: 'connected',
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 0
  },
  {
    id: 'acad-2569-img',
    name: '📁 ภาพประกอบ',
    type: 'category',
    department: 'academic',
    academicYear: '2569',
    folderCategory: 'images',
    parentFolderId: 'acad-2569-year',
    googleDriveFolderId: '1_Acad_2569_Img_ID',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_Acad_2569_Img_ID',
    status: 'connected',
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    subfolderCount: 0
  }
];
