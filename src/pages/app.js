/* ══════════════════════════════════════════════════
   SUPABASE CONFIG
   ضع مفاتيحك هنا بعد إنشاء مشروع على supabase.com
══════════════════════════════════════════════════ */
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY';

// نمط عمل ذكي: إذا لم يُضف المستخدم Supabase بعد، يعمل بالبيانات المحلية
let USE_SUPABASE = (SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co');
let sb = null;
let rtChannel = null;

if (USE_SUPABASE) {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
}

/* ══════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════ */
const CATS = {
  sweets:  {label:'🍰 حلويات',  color:'#FF6B9D', bg:'#FFF0F6'},
  cooking: {label:'🍳 طبخ منزلي',color:'#F5A623', bg:'#FFFBF0'},
  bakery:  {label:'🥐 مخبوزات', color:'#8B5CF6', bg:'#F5F0FF'},
  coffee:  {label:'☕ قهوة',    color:'#10B981', bg:'#F0FDF9'},
  matcha:  {label:'🍵 ماتشا',   color:'#3D6B4F', bg:'#F0FAF4'},
  handmade:{label:'🧶 يدوية',   color:'#EC4899', bg:'#FFF0F7'},
};
const EMOJI = {sweets:'🍰',cooking:'🍳',bakery:'🥐',coffee:'☕',matcha:'🍵',handmade:'🧶'};
const CAT_C = {sweets:'#FF6B9D',cooking:'#F5A623',bakery:'#8B5CF6',coffee:'#10B981',matcha:'#3D6B4F',handmade:'#EC4899'};
const DEF = {lat:24.467, lng:39.614};
const ST_LABEL = {pending:'قيد الانتظار',confirmed:'مؤكد',preparing:'جاري التحضير',ready:'جاهز',done:'مكتمل',cancelled:'ملغي'};
const ST_CLS   = {pending:'os-p',confirmed:'os-c',preparing:'os-c',ready:'os-d',done:'os-d',cancelled:'os-x'};

/* ══════════════════════════════════════════════════
   LOCAL SEED DATA (fallback when no Supabase)
══════════════════════════════════════════════════ */
const SEED_FAMILIES = [
  {id:'1',name:"حلويات أم سارة",cat:"sweets",emoji:"🍰",desc:"تخصصنا في الحلويات المنزلية الشرقية والغربية بأعلى جودة وأجمل تقديم.",phone:"+966501234567",instagram:"@om_sara_sweets",snap:"@omsara",tiktok:"@omsarasweets",lat:24.470,lng:39.613,working_hours:[{d:"السبت–الخميس",t:"٩ص–١١م"},{d:"الجمعة",t:"٤م–١١م"}],likes_count:143},
  {id:'2',name:"مطبخ الحاجة فاطمة",cat:"cooking",emoji:"🍳",desc:"وجبات منزلية يومية بالطابع السعودي الأصيل. طلبات الجمعة والمناسبات متاحة.",phone:"+966507654321",instagram:"@hajja_fatima",snap:"@fatimakitchen",lat:24.467,lng:39.618,working_hours:[{d:"السبت–الخميس",t:"١١ص–٩م"},{d:"الجمعة",t:"٣م–٩م"}],likes_count:87},
  {id:'3',name:"مخبز الدار",cat:"bakery",emoji:"🥐",desc:"مخبوزات طازجة يومية — خبز حار، كرواسون، مناقيش، وأقراص.",phone:"+966509876543",instagram:"@al_dar_bakery",lat:24.473,lng:39.608,working_hours:[{d:"يومياً",t:"٦ص–٢م"}],likes_count:201},
  {id:'4',name:"قهوة العصر",cat:"coffee",emoji:"☕",desc:"مختصات قهوة منزلية مع أجواء دافئة. توصيل لمناطق المدينة المنورة.",phone:"+966506543210",instagram:"@asr_coffee",tiktok:"@asrcoffee",lat:24.464,lng:39.621,working_hours:[{d:"يومياً",t:"٧ص–١٢م"}],likes_count:316},
  {id:'5',name:"ماتشا سكاي",cat:"matcha",emoji:"🍵",desc:"متخصصون في مشروبات وحلويات الماتشا اليابانية الأصيلة بماتشا سيريمونيال مستوردة.",phone:"+966504112233",instagram:"@matcha_sky_sa",snap:"@matchasky",tiktok:"@matchaskysa",lat:24.462,lng:39.619,working_hours:[{d:"السبت–الخميس",t:"٨ص–١١م"},{d:"الجمعة",t:"٢م–١٢م"}],likes_count:289},
  {id:'6',name:"أنامل نور",cat:"handmade",emoji:"🧶",desc:"منتجات يدوية متنوعة — كروشيه، تطريز، هدايا مخصصة للمناسبات.",phone:"+966508765432",instagram:"@noor_crafts",snap:"@ananilnoor",lat:24.476,lng:39.610,working_hours:[{d:"السبت–الأربعاء",t:"٩ص–٦م"}],likes_count:59},
  {id:'7',name:"عسل الجبل",cat:"handmade",emoji:"🍯",desc:"عسل طبيعي أصلي من مزارع الحجاز. منتجات عضوية معتمدة.",phone:"+966503214567",instagram:"@jabal_honey",lat:24.460,lng:39.615,working_hours:[{d:"يومياً",t:"طوال اليوم"}],likes_count:422},
  {id:'8',name:"حليب الناقة",cat:"cooking",emoji:"🥛",desc:"حليب ناقة طازج يومي من مزرعة خاصة. توصيل صباحي لأحياء المدينة.",phone:"+966501357924",instagram:"@camel_milk_kh",lat:24.455,lng:39.625,working_hours:[{d:"يومياً",t:"٦ص–١٠ص"}],likes_count:178},
];
const SEED_PRODUCTS = {
  '1':[{id:'p1',name:"كنافة بالجبن",price:45,emoji:"🧀",desc:"طازجة يومياً"},{id:'p2',name:"تشيز كيك",price:55,emoji:"🎂",desc:"نيويورك ستايل"},{id:'p3',name:"براونيز",price:60,emoji:"🍫",desc:"شوكولاتة بلجيكية"},{id:'p4',name:"مهلبية",price:20,emoji:"🍮",desc:"بالهيل والورد"}],
  '2':[{id:'p5',name:"كبسة لحم",price:80,emoji:"🍖",desc:"كيلو ونص"},{id:'p6',name:"مطبق",price:35,emoji:"🥟",desc:"طبق ٦ قطع"},{id:'p7',name:"جريش",price:45,emoji:"🫕",desc:"وجبة كاملة"},{id:'p8',name:"هريس",price:50,emoji:"🫔",desc:"حصة رمضانية"}],
  '3':[{id:'p9',name:"خبز تنور",price:10,emoji:"🫓",desc:"رغيف طازج"},{id:'p10',name:"كرواسون",price:8,emoji:"🥐",desc:"زبدة فرنساوي"},{id:'p11',name:"مناقيش",price:15,emoji:"🫓",desc:"زعتر وجبنة"},{id:'p12',name:"قرص عقيلي",price:12,emoji:"🫙",desc:"تقليدي"}],
  '4':[{id:'p13',name:"V60 قهوة",price:22,emoji:"☕",desc:"تخمير يدوي"},{id:'p14',name:"لاتيه",price:18,emoji:"🥛",desc:"بالحليب الكامل"},{id:'p15',name:"قهوة عربية",price:15,emoji:"🫖",desc:"بالهيل"},{id:'p16',name:"كولد برو",price:25,emoji:"🧊",desc:"مخمر ٢٤ ساعة"}],
  '5':[{id:'p17',name:"لاتيه ماتشا",price:22,emoji:"🍵",desc:"حليب بالبخار"},{id:'p18',name:"كيك ماتشا",price:65,emoji:"🎂",desc:"تيرامسو ماتشا"},{id:'p19',name:"مافن ماتشا",price:18,emoji:"🧁",desc:"قلب ماتشا"},{id:'p20',name:"آيس ماتشا",price:25,emoji:"🧊",desc:"بارد بالفانيليا"}],
  '6':[{id:'p21',name:"حقيبة كروشيه",price:120,emoji:"👜",desc:"ألوان حسب الطلب"},{id:'p22',name:"إطار تطريز",price:80,emoji:"🖼️",desc:"اسم مخصص"},{id:'p23',name:"بوكيه ورد",price:95,emoji:"💐",desc:"هدية مميزة"},{id:'p24',name:"سجادة",price:150,emoji:"🪆",desc:"كروشيه"}],
  '7':[{id:'p25',name:"عسل سدر",price:250,emoji:"🍯",desc:"كيلو أصلي"},{id:'p26',name:"عسل السمر",price:180,emoji:"🫙",desc:"نصف كيلو"},{id:'p27',name:"حبة البركة",price:45,emoji:"🌿",desc:"عضوية نقية"},{id:'p28',name:"عسل مفرّح",price:320,emoji:"🐝",desc:"ملكي جبلي"}],
  '8':[{id:'p29',name:"لتر حليب",price:30,emoji:"🥛",desc:"يومي طازج"},{id:'p30',name:"لبن جمل",price:55,emoji:"🫙",desc:"خثيرة طازجة"},{id:'p31',name:"سمن بعير",price:200,emoji:"🧈",desc:"250 جرام"},{id:'p32',name:"اشتراك أسبوعي",price:190,emoji:"📋",desc:"7 لترات"}],
};
const SEED_OFFERS = {
  '1': [{id:'of-1', title:'خصم نهاية الأسبوع', desc:'على جميع الحلويات', discount_type:'percent', discount_val:15, code:'SWEET15', expires_at:null, is_active:true}],
  '4': [{id:'of-2', title:'قهوة اليوم', desc:'خصم على اللاتيه', discount_type:'fixed', discount_val:5, code:'LATTE5', expires_at:null, is_active:true}]
};
const SEED_NOTIFICATIONS = [
  {id:'n1', type:'order',  title:'📦 طلب جديد وصل!',          body:'طلب بإجمالي 90 ر.س ينتظر موافقتك',          read:false, created_at: new Date(Date.now()-3*60*1000).toISOString()},
  {id:'n2', type:'like',   title:'👍 إعجاب جديد على مشروعك', body:'أعجب شخص بمشروعك وأضافه للمفضلة',         read:false, created_at: new Date(Date.now()-18*60*1000).toISOString()},
  {id:'n3', type:'review', title:'⭐ تقييم 5 نجوم جديد',    body:'حصلت على تقييم ممتاز من أحد عملائك',          read:false, created_at: new Date(Date.now()-45*60*1000).toISOString()},
  {id:'n4', type:'order',  title:'✅ تم تأكيد الطلب',        body:'الطلب ord-2 تم تأكيده وجاري التحضير',           read:true,  created_at: new Date(Date.now()-2*60*60*1000).toISOString()},
  {id:'n5', type:'system', title:'🎉 مرحباً في أسر قريبة!',  body:'حسابك جاهز — ابدأ بإضافة منتجاتك لتظهر على الخريطة',  read:true,  created_at: new Date(Date.now()-24*60*60*1000).toISOString()},
];

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let families = [];
let products = {};   // { familyId: [...] }
let orders   = [];
let offersByFamily = {}; // { familyId: [...] }
let currentUser = null;
let myFamily = null;
let activeFilter = 'all';
let filteredFamilies = [];
let likesSet = new Set();   // ids liked by current user
let cartItems = {};         // { productId: qty }
let currentOrderFamilyId = null;
let currentReviewFamilyId = null;
let reviewStars = 0;
let mapObj = null, mapMarkers = [];
let mapInit = false;
let catSel = {};
let addImageFile = null;
let prodImageFile = null;
let searchDebounceTimer = null;
let notifications = [];

/* ══════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════ */
window.addEventListener('load', async () => {
  showLoading(true);
  try {
    await loadData();
    if (USE_SUPABASE) {
      await checkSession();
      setupRealtime();
    }
    updateHeroCount();
    await tryOpenProfileFromUrl();
    document.getElementById('btnExplore').style.display = 'flex';
  } catch(e) { console.warn('boot error', e); }
  showLoading(false);

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
});

async function loadData() {
  if (USE_SUPABASE) {
    const {data: fams} = await sb.from('families')
      .select('*, likes(count)')
      .eq('is_active', true)
      .order('created_at', {ascending: false});
    families = (fams || []).map(f => ({
      ...f,
      likes_count: f.likes?.[0]?.count || 0
    }));
  } else {
    families = [...SEED_FAMILIES];
    products = {...SEED_PRODUCTS};
    offersByFamily = {...SEED_OFFERS};
  }
  filteredFamilies = [...families];
  document.getElementById('cntAll').textContent = families.length;
}

async function loadProducts(familyId) {
  if (products[familyId]) return products[familyId];
  if (USE_SUPABASE) {
    const {data} = await sb.from('products')
      .select('*')
      .eq('family_id', familyId)
      .eq('in_stock', true)
      .order('sort_order');
    products[familyId] = data || [];
  } else {
    products[familyId] = SEED_PRODUCTS[familyId] || [];
  }
  return products[familyId];
}

async function loadOrders() {
  if (!currentUser || !USE_SUPABASE) {
    orders = [
      {id:'ord-1',family_name:'حلويات أم سارة',items:[{name:'كنافة بالجبن',qty:2,price:45}],total:90,status:'done',created_at:new Date().toISOString()},
      {id:'ord-2',family_name:'مطبخ الحاجة فاطمة',items:[{name:'كبسة لحم',qty:1,price:80}],total:80,status:'confirmed',created_at:new Date().toISOString()},
      {id:'ord-3',family_name:'مخبز الدار',items:[{name:'كرواسون',qty:5,price:8}],total:40,status:'pending',created_at:new Date().toISOString()},
      {id:'ord-4',family_name:'قهوة العصر',items:[{name:'لاتيه',qty:3,price:18}],total:54,status:'cancelled',created_at:new Date().toISOString()},
    ];
    return;
  }
  const {data} = await sb.from('orders')
    .select('*, families(name)')
    .order('created_at', {ascending: false})
    .limit(20);
  orders = (data || []).map(o => ({...o, family_name: o.families?.name || '—'}));
}

async function loadOffers(familyId) {
  if (!familyId) return [];
  const key = String(familyId);
  if (offersByFamily[key]) return offersByFamily[key];

  if (USE_SUPABASE) {
    const nowIso = new Date().toISOString();
    const {data, error} = await sb.from('offers')
      .select('*')
      .eq('family_id', familyId)
      .eq('is_active', true)
      .order('created_at', {ascending:false});
    if (!error) {
      offersByFamily[key] = (data || []).filter(o => !o.expires_at || o.expires_at > nowIso);
      return offersByFamily[key];
    }
  }

  offersByFamily[key] = (SEED_OFFERS[key] || []).filter(o => o.is_active !== false);
  return offersByFamily[key];
}

/* ══════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════ */
async function loadNotifications() {
  if (!currentUser) { notifications = []; return; }
  if (USE_SUPABASE) {
    try {
      const {data, error} = await sb.from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', {ascending:false})
        .limit(30);
      if (!error && data) { notifications = data; updateNotifBadge(); return; }
    } catch (_) {}
  }
  notifications = [...SEED_NOTIFICATIONS];
  updateNotifBadge();
}

function getUnreadCount() { return notifications.filter(n => !n.read).length; }

function addNotification(type, title, body) {
  notifications.unshift({
    id: 'local-' + Date.now(),
    type, title, body,
    read: false,
    created_at: new Date().toISOString()
  });
  updateNotifBadge();
  const panel = document.getElementById('notifPanel');
  if (panel?.classList.contains('open')) renderNotifPanel();
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)    return 'الآن';
  if (diff < 3600)  return `منذ ${Math.floor(diff/60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff/3600)} ساعة`;
  return `منذ ${Math.floor(diff/86400)} يوم`;
}

const NOTIF_ICONS = { order:'📦', like:'👍', review:'⭐', system:'📢' };

function renderNotifPanel() {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (!notifications.length) {
    list.innerHTML = '<div class="notif-empty"><div class="notif-empty-ic">🔔</div><p>لا توجد إشعارات بعد</p></div>';
    return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item${n.read ? '' : ' unread'}" onclick="markRead('${n.id}')">
      <div class="notif-ic ${n.type}">${NOTIF_ICONS[n.type] || '📢'}</div>
      <div class="notif-bd">
        <div class="notif-ttl">${n.title}</div>
        <div class="notif-msg">${n.body}</div>
        <div class="notif-ts">${timeAgo(n.created_at)}</div>
      </div>
    </div>`).join('');
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  const count = getUnreadCount();
  badge.textContent = count > 9 ? '9+' : String(count);
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function openNotifications() {
  if (!currentUser) { openAuth('login'); return; }
  renderNotifPanel();
  document.getElementById('notifPanel')?.classList.add('open');
  const bd = document.getElementById('notifBackdrop');
  if (bd) bd.style.display = 'block';
}

function closeNotifications() {
  document.getElementById('notifPanel')?.classList.remove('open');
  const bd = document.getElementById('notifBackdrop');
  if (bd) bd.style.display = 'none';
}

function markRead(notifId) {
  const n = notifications.find(x => x.id === String(notifId));
  if (!n || n.read) return;
  n.read = true;
  if (USE_SUPABASE && currentUser) {
    sb.from('notifications').update({read:true}).eq('id', notifId).then(()=>{});
  }
  updateNotifBadge();
  renderNotifPanel();
}

function markAllRead() {
  notifications.forEach(n => n.read = true);
  if (USE_SUPABASE && currentUser) {
    sb.from('notifications').update({read:true}).eq('user_id', currentUser.id).then(()=>{});
  }
  updateNotifBadge();
  renderNotifPanel();
}

/* ══════════════════════════════════════════════════
   SESSION & AUTH
══════════════════════════════════════════════════ */
async function checkSession() {
  const {data: {session}} = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadMyFamily();
    await loadNotifications();
    updateAuthArea();
  }
  sb.auth.onAuthStateChange(async (_ev, s) => {
    currentUser = s?.user || null;
    if (currentUser) { await loadMyFamily(); await loadNotifications(); }
    else { myFamily = null; notifications = []; }
    updateAuthArea();
  });
}

async function loadMyFamily() {
  if (!USE_SUPABASE || !currentUser) return;
  const {data} = await sb.from('families')
    .select('*').eq('user_id', currentUser.id).single();
  myFamily = data || null;
}

async function doLogin() {
  const email = document.getElementById('lEmail').value.trim();
  const pass  = document.getElementById('lPass').value;
  const err   = document.getElementById('lErr');
  err.style.display = 'none';
  if (!email || !pass) { showErr(err, 'يرجى تعبئة جميع الحقول'); return; }
  if (!isValidEmail(email)) { showErr(err, 'صيغة البريد الإلكتروني غير صحيحة'); return; }

  if (!USE_SUPABASE) {
    // Demo mode
    const demos = {'omar@test.com':'123456','fatima@test.com':'123456'};
    if (demos[email] === pass) {
      currentUser = {id:'demo-1', email, user_metadata:{name: email.split('@')[0]}};
      myFamily = families.find(f => f.id === '1') || null;
      await loadNotifications();
      closeAuth(); updateAuthArea();
      showToast('👋 أهلاً بك!');
    } else { showErr(err, 'البريد أو كلمة المرور غير صحيحة'); }
    return;
  }

  setBtnLoading('loginBtn', true);
  try {
    const {error} = await sb.auth.signInWithPassword({email, password: pass});
    if (error) { showErr(err, 'البريد أو كلمة المرور غير صحيحة'); return; }
    closeAuth();
    showToast('👋 أهلاً بك!');
  } catch (_e) {
    showErr(err, 'تعذر تسجيل الدخول حالياً، حاول لاحقاً');
  } finally {
    setBtnLoading('loginBtn', false);
  }
}

async function doRegister() {
  const name  = document.getElementById('rName').value.trim();
  const email = document.getElementById('rEmail').value.trim();
  const pass  = document.getElementById('rPass').value;
  const biz   = document.getElementById('rBiz').value.trim();
  const phone = document.getElementById('rPhone').value.trim();
  const cat   = catSel['rCatPick'] || '';
  const err   = document.getElementById('rErr');
  err.style.display = 'none';

  if (!name||!email||!pass||!biz||!phone||!cat) { showErr(err,'يرجى تعبئة جميع الحقول واختيار الفئة'); return; }
  if (!isValidEmail(email)) { showErr(err, 'صيغة البريد الإلكتروني غير صحيحة'); return; }
  if (!isValidPhone(phone)) { showErr(err, 'رقم الجوال غير صحيح'); return; }
  if (pass.length < 6) { showErr(err,'كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }

  if (!USE_SUPABASE) {
    // Demo mode — add to local data
    const newFam = {
      id: String(families.length+1), name:biz, cat, emoji:EMOJI[cat]||'🏡',
      desc:`مشروع ${biz}`, phone:normalizePhone(phone), instagram:'', snap:'', tiktok:'',
      lat: DEF.lat+(Math.random()-.5)*.02, lng: DEF.lng+(Math.random()-.5)*.02,
      working_hours:[{d:'يومياً',t:'٩ص–١٠م'}], likes_count:0
    };
    families.push(newFam);
    products[newFam.id] = [];
    filteredFamilies = [...families];
    currentUser = {id:'demo-new', email, user_metadata:{name}};
    myFamily = newFam;
    await loadNotifications();
    document.getElementById('cntAll').textContent = families.length;
    refreshMapViews();
    closeAuth(); updateAuthArea();
    showToast(`🎉 أهلاً ${name}! تم إنشاء حسابك`);
    return;
  }

  setBtnLoading('regBtn', true);
  try {
    const {data: authData, error: authErr} = await sb.auth.signUp({
      email, password: pass,
      options: { data: { name, phone: normalizePhone(phone) } }
    });
    if (authErr) { showErr(err, authErr.message); return; }

    const slug = biz.replace(/\s+/g,'-').toLowerCase() + '-' + Date.now();
    const {data: famData, error: famErr} = await sb.from('families').insert({
      user_id: authData.user.id, name: biz, slug, cat,
      emoji: EMOJI[cat]||'🏡',
      desc: `مشروع ${biz} — ${(CATS[cat]||{}).label||cat}`,
      phone: normalizePhone(phone), lat: DEF.lat, lng: DEF.lng,
      working_hours: [{d:'يومياً', t:'٩ص–١٠م'}]
    }).select().single();

    if (famErr) { showErr(err, 'حدث خطأ، حاول مجدداً'); return; }

    myFamily = famData;
    await loadData();
    refreshMapViews();
    closeAuth(); updateAuthArea();
    showToast(`🎉 أهلاً ${name}! تم إنشاء مشروعك`);
  } catch (_e) {
    showErr(err, 'تعذر إنشاء الحساب حالياً، حاول لاحقاً');
  } finally {
    setBtnLoading('regBtn', false);
  }
}

function doLogout() {
  if (USE_SUPABASE) { sb.auth.signOut(); }
  currentUser = null; myFamily = null;
  closeDash(); updateAuthArea();
  goPage('land');
  showToast('👋 تم تسجيل الخروج');
}

function updateAuthArea() {
  const area = document.getElementById('authArea');
  if (currentUser) {
    const initial = (currentUser.user_metadata?.name || currentUser.email || 'م').charAt(0).toUpperCase();
    const uc = getUnreadCount();
    area.innerHTML = `<div style="display:flex;align-items:center;gap:7px;">
      <button class="btn-g" onclick="openDash()" style="border-color:#6366F1;color:#6366F1">📊 لوحتي</button>
      <button class="btn-g" onclick="openSettings()">⚙️ إعدادات</button>
      <button class="notif-btn" onclick="openNotifications()" title="الإشعارات">🔔<span class="notif-badge" id="notifBadge" style="display:${uc>0?'flex':'none'}">${uc>9?'9+':uc}</span></button>
      <div class="uav" onclick="doLogout()" title="تسجيل خروج">${initial}<div class="odot"></div></div>
    </div>`;
  } else {
    area.innerHTML = `<button class="btn-p" onclick="openAuth('login')">دخول</button>`;
  }
}

/* ══════════════════════════════════════════════════
   REALTIME
══════════════════════════════════════════════════ */
function setupRealtime() {
  if (!USE_SUPABASE || !sb) return;
  rtChannel = sb.channel('public-changes')
    .on('postgres_changes', {event:'INSERT', schema:'public', table:'families'}, payload => {
      families.push({...payload.new, likes_count:0});
      filteredFamilies = [...families];
      document.getElementById('cntAll').textContent = families.length;
      refreshMapViews();
      updateHeroCount();
      showToast('🏡 أسرة جديدة انضمت للمنطقة!');
    })
    .on('postgres_changes', {event:'INSERT', schema:'public', table:'orders'}, payload => {
      if (myFamily && payload.new.family_id === myFamily.id) {
        showToast('📦 طلب جديد وصل! تحقق من لوحة التحكم');
        addNotification('order', '📦 طلب جديد وصل!', `إجمالي الطلب ${payload.new.total || 0} ر.س — افتح لوحة التحكم للتأكيد`);
        orders.unshift(payload.new);
      }
    })
    .on('postgres_changes', {event:'INSERT', schema:'public', table:'likes'}, payload => {
      const fam = families.find(f => f.id === payload.new.family_id);
      if (fam) fam.likes_count = (fam.likes_count||0) + 1;
      if (myFamily && String(payload.new.family_id) === String(myFamily.id)) {
        addNotification('like', '👍 إعجاب جديد على مشروعك', `أعجب شخص بمشروع ${myFamily.name}`);
      }
      refreshMapViews(true);
    })
    .subscribe();
}

/* ══════════════════════════════════════════════════
   PAGE ROUTER
══════════════════════════════════════════════════ */
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('pg-'+id);
  if (!page) { showToast('⚠️ الصفحة غير متاحة حالياً'); goPage('land'); return; }
  page.classList.add('active');
  const isMap = id === 'map';
  document.getElementById('filterBar').style.display = isMap ? 'flex' : 'none';
  document.getElementById('mainSearch').style.display = isMap ? 'block' : 'none';
  if (isMap && !mapInit) { initMap(); mapInit = true; }
  window.scrollTo(0,0);
}

function getProfileLink(fam) {
  const url = new URL(window.location.href);
  url.searchParams.set('family', fam.slug || fam.id);
  return url.toString();
}

function syncProfileUrl(fam) {
  const url = new URL(window.location.href);
  url.searchParams.set('family', fam.slug || fam.id);
  window.history.replaceState({}, '', url);
}

function clearProfileUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('family');
  window.history.replaceState({}, '', url);
}

async function copyProfileLink(id) {
  const fam = families.find(f => String(f.id) === String(id));
  if (!fam) { showToast('⚠️ تعذر إنشاء رابط البروفايل'); return; }

  const profileLink = getProfileLink(fam);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(profileLink);
    } else {
      const input = document.createElement('textarea');
      input.value = profileLink;
      input.setAttribute('readonly', 'readonly');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    showToast('🔗 تم نسخ رابط البروفايل');
  } catch (_e) {
    showToast('⚠️ تعذر نسخ الرابط، انسخه يدوياً من شريط العنوان');
  }
}

async function tryOpenProfileFromUrl() {
  const profileKey = new URLSearchParams(window.location.search).get('family');
  if (!profileKey) return;

  const fam = families.find(f => String(f.id) === String(profileKey) || String(f.slug || '') === String(profileKey));
  if (!fam) return;

  await openProfile(fam.id);
}

function openSettings() {
  if (!currentUser) { openAuth('login'); return; }
  hydrateSettings();
  goPage('settings');
}

/* ══════════════════════════════════════════════════
   MAP
══════════════════════════════════════════════════ */
function initMap() {
  mapObj = L.map('map', {zoomControl:false}).setView([DEF.lat, DEF.lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'© OpenStreetMap', maxZoom:19}).addTo(mapObj);
  L.control.zoom({position:'bottomleft'}).addTo(mapObj);
  renderMarkers(); renderSidebar();
}

function mkIcon(fam) {
  const c = CAT_C[fam.cat] || '#E8531A';
  const img = fam.image_url ? `<img src="${fam.image_url}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : fam.emoji;
  return L.divIcon({
    html:`<div style="width:42px;height:42px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 14px rgba(0,0,0,.18),0 0 0 3px ${c};overflow:hidden;">${img}</div>`,
    className:'', iconSize:[42,42], iconAnchor:[21,21], popupAnchor:[0,-24]
  });
}

function renderMarkers() {
  mapMarkers.forEach(m => mapObj.removeLayer(m));
  mapMarkers = [];
  filteredFamilies.forEach(fam => {
    const lks = fam.likes_count || 0;
    const m = L.marker([fam.lat, fam.lng], {icon: mkIcon(fam)})
      .addTo(mapObj)
      .bindPopup(`<div class="mpop">
        <div class="mph">
          <div class="mpav" style="background:${(CATS[fam.cat]||{}).bg||'#f0f0f0'}">${fam.emoji}</div>
          <div><div class="mpnm">${fam.name}</div><div class="mpct">${(CATS[fam.cat]||{}).label||fam.cat}</div></div>
        </div>
        <div class="mplk">👍 ${lks} إعجاب</div>
        <button class="mpp" onclick="openProfile('${fam.id}')">عرض البروفايل ←</button>
      </div>`, {maxWidth:260});
    mapMarkers.push(m);
  });
}

function renderSidebar() {
  const list = document.getElementById('sbList');
  document.getElementById('sbTitle').textContent = `أسر قريبة منك — ${filteredFamilies.length} نتيجة`;
  if (!filteredFamilies.length) { list.innerHTML = `<div class="empty"><div class="ei">🔍</div><p>لا توجد نتائج</p></div>`; return; }
  list.innerHTML = filteredFamilies.map(fam => `
    <div class="fcard" onclick="openProfile('${fam.id}');mapObj.setView([${fam.lat},${fam.lng}],16,{animate:true})">
      <div class="fcav" style="background:${(CATS[fam.cat]||{}).bg||'#f0f0f0'}">${fam.emoji}</div>
      <div class="fci">
        <div class="fcnm">${fam.name}</div>
        <div class="fcds">${(fam.desc||'').slice(0,46)}…</div>
        <div class="fcm">
          <span class="fcbg${fam.cat==='matcha'?' mb':''}">${(CATS[fam.cat]||{}).label||fam.cat}</span>
          <span class="fclk">👍 ${fam.likes_count||0}</span>
        </div>
      </div>
    </div>`).join('');
}

function filterBy(cat, el) {
  activeFilter = cat;
  document.querySelectorAll('.fc').forEach(c => c.classList.remove('act'));
  el.classList.add('act');
  applyFilters();
}

function applyFilters() {
  const q = (document.getElementById('searchInput').value||'').trim().toLowerCase();
  filteredFamilies = families.filter(f => {
    const okC = activeFilter === 'all' || f.cat === activeFilter;
    const okQ = !q || f.name.includes(q) || (f.desc||'').includes(q) || (CATS[f.cat]?.label||'').includes(q);
    return okC && okQ;
  });
  refreshMapViews();
}

function onSearchInput() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(applyFilters, 140);
}

function refreshMapViews(sidebarOnly=false) {
  if (!mapObj) return;
  if (!sidebarOnly) renderMarkers();
  renderSidebar();
}

function locateUser() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(p => {
    mapObj.setView([p.coords.latitude, p.coords.longitude], 15, {animate:true});
    L.circleMarker([p.coords.latitude, p.coords.longitude], {
      radius:10, fillColor:'#E8531A', fillOpacity:.9, color:'#fff', weight:3
    }).addTo(mapObj).bindPopup('📍 موقعك').openPopup();
  }, () => mapObj.setView([DEF.lat, DEF.lng], 14, {animate:true}));
}

/* ══════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════ */
async function openProfile(id) {
  showLoading(true);
  const fam = families.find(f => String(f.id) === String(id));
  if (!fam) { showLoading(false); return; }
  syncProfileUrl(fam);

  const prods = await loadProducts(id);
  const offers = await loadOffers(id);

  // Check if user liked this family
  let isLiked = likesSet.has(String(id));
  if (USE_SUPABASE && currentUser && !isLiked) {
    const {data} = await sb.from('likes')
      .select('id').eq('family_id', id).eq('user_id', currentUser.id).maybeSingle();
    if (data) { likesSet.add(String(id)); isLiked = true; }
  }

  showLoading(false);
  const isMat = fam.cat === 'matcha';
  const catBg = (CATS[fam.cat]||{}).bg || '#f0f0f0';
  const lks = fam.likes_count || 0;
  const hours = fam.working_hours || [];

  const _IG   = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
  const _SNAP = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.17 2C9.11 2 7.25 4.06 7.25 6.5v1.06l-1.37.72c-.27.14-.28.55-.03.71l1.4.9v.75c-.43.32-1.07.64-1.75.85-.31.09-.44.43-.26.67l.61.82-.17.07c-.3.12-.44.45-.3.74l.34.72c.11.24.36.38.62.37.38-.02.75-.08 1.16-.18.63.84 1.56 1.27 2.66 1.27s2.03-.43 2.66-1.27c.41.1.78.16 1.16.18.26.01.51-.13.62-.37l.34-.72c.13-.3-.01-.62-.3-.74l-.17-.07.61-.82c.18-.24.05-.58-.26-.67-.68-.2-1.32-.53-1.75-.85v-.75l1.4-.9c.25-.16.24-.57-.03-.71l-1.37-.72V6.5C17.08 3.96 15.08 2 12.17 2z"/></svg>`;
  const _TT   = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>`;
  const _WEB  = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const social = [
    fam.instagram ? `<a class="scbtn scbtn-ig" href="https://instagram.com/${fam.instagram.replace('@','')}" target="_blank" rel="noopener">${_IG} ${fam.instagram}</a>` : '',
    fam.snap      ? `<a class="scbtn scbtn-snap" href="https://snapchat.com/add/${fam.snap.replace('@','')}" target="_blank" rel="noopener">${_SNAP} ${fam.snap}</a>` : '',
    fam.tiktok    ? `<a class="scbtn scbtn-tt" href="https://tiktok.com/${fam.tiktok}" target="_blank" rel="noopener">${_TT} ${fam.tiktok}</a>` : '',
    fam.website   ? `<a class="scbtn scbtn-web" href="${fam.website}" target="_blank" rel="noopener">${_WEB} الموقع</a>` : '',
  ].filter(Boolean).join('');

  const menuHTML = prods.map(it => `
    <div class="mi${isMat?' mat':''}">
      <div class="mimg">${it.image_url ? `<img src="${it.image_url}" alt="${it.name}">` : it.emoji}</div>
      <div class="minf">
        <div class="mnm">${it.name}</div>
        <div class="mds">${it.desc||''}</div>
        <div class="mpr">${it.price} ر.س</div>
      </div>
    </div>`).join('');

  const hoursHTML = hours.map(h => `<div class="hri"><div class="hrd">${h.d}</div><div class="hrt">${h.t}</div></div>`).join('');
  const offersHtml = offers.length
    ? offers.map(o => {
        const offVal = o.discount_type === 'fixed' ? `${o.discount_val} ر.س` : `${o.discount_val}%`;
        const exp = o.expires_at ? `ينتهي: ${new Date(o.expires_at).toLocaleDateString('ar-SA')}` : 'بدون تاريخ انتهاء';
        return `<div class="offer-box"><div class="offer-title">🎁 ${o.title} · خصم ${offVal}</div><div class="offer-meta">${o.desc || 'عرض لفترة محدودة'} · ${exp}</div>${o.code ? `<span class="offer-code">${o.code}</span>` : ''}</div>`;
      }).join('')
    : '<p style="color:var(--mu);font-size:.82rem;text-align:center;padding:12px 0">لا توجد عروض حالياً</p>';

  document.getElementById('profilePanel').innerHTML = `
    <button class="pclose" onclick="closeProfile()">✕</button>
    <div class="pcov">
      <div class="pcbg">${fam.emoji}</div>
      <div class="pav" style="background:${catBg}">${fam.image_url ? `<img src="${fam.image_url}" alt="${fam.name}">` : fam.emoji}</div>
      <div class="phi">
        <div class="pnm">${fam.name}</div>
        <div class="pcat">${(CATS[fam.cat]||{}).label||fam.cat}${fam.is_verified?'  ✅':''}</div>
      </div>
    </div>
    <div class="pbod">
      <p class="pdsc">${fam.desc||''}</p>
      <div class="psts">
        <div class="stb"><div class="stv">${lks}</div><div class="stl">إعجاب</div></div>
        <div class="stb"><div class="stv">${prods.length}</div><div class="stl">منتج</div></div>
        <div class="stb"><div class="stv">${fam.avg_rating ? fam.avg_rating.toFixed(1)+'⭐' : '—'}</div><div class="stl">تقييم</div></div>
      </div>

      <div class="lksec">
        <button class="btnlk${isLiked?' lkd':''}" id="lkBtn_${id}" onclick="toggleLike('${id}')">👍 ${isLiked?'أعجبني':'إعجاب'}</button>
        <span class="lkcnt" id="lkCnt_${id}">${lks} شخص أعجبه هذا</span>
      </div>

      <button class="order-btn" onclick="openOrder('${id}')">🛒 اطلب الآن</button>

      <div class="arow">
        <button class="abtn" onclick="window.location.href='tel:${fam.phone}'"><span class="ai">📞</span>اتصال</button>
        <button class="abtn" onclick="window.open('https://wa.me/${(fam.phone||'').replace(/\D/g,'')}','_blank')"><span class="ai">💬</span>واتساب</button>
        <button class="abtn" onclick="window.open('https://maps.google.com/?q=${fam.lat},${fam.lng}','_blank')"><span class="ai">📍</span>الموقع</button>
      </div>

      <button class="btn-g profile-share-btn" onclick="copyProfileLink('${id}')">🔗 نسخ رابط البروفايل</button>

      ${social ? `<div class="sect">حساباتنا</div><div class="scrow">${social}</div>` : ''}

      ${hours.length ? `<div class="sect">ساعات العمل</div><div class="hrgrid">${hoursHTML}</div>` : ''}

      <div class="sect">العروض والكوبونات</div>
      <div>${offersHtml}</div>

      <div class="sect">الموقع</div>
      <div class="pmap" id="mm_${id}"></div>

      <div class="sect">المنيو</div>
      ${prods.length ? `<div class="mgrid">${menuHTML}</div>` : '<p style="color:var(--mu);font-size:.84rem;text-align:center;padding:20px">لا توجد منتجات مضافة بعد</p>'}

      <div class="sect">تقييم الأسرة</div>
      <button class="abtn" style="width:100%;margin-bottom:18px" onclick="openReview('${id}')">⭐ أضف تقييمك</button>
    </div>`;

  document.getElementById('ovProfile').classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const el = document.getElementById(`mm_${id}`);
    if (!el || el._leaflet_id) return;
    const mm = L.map(el, {zoomControl:false, dragging:false, scrollWheelZoom:false}).setView([fam.lat, fam.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mm);
    L.marker([fam.lat, fam.lng], {icon: mkIcon(fam)}).addTo(mm);
  }, 120);
}

function closeProfile() { document.getElementById('ovProfile').classList.remove('open'); document.body.style.overflow = ''; clearProfileUrl(); }

/* ══════════════════════════════════════════════════
   LIKE
══════════════════════════════════════════════════ */
async function toggleLike(id) {
  if (!currentUser) { showToast('⚠️ سجّل دخولك أولاً للإعجاب'); openAuth('login'); return; }
  const fam = families.find(f => String(f.id) === String(id));
  if (!fam) return;

  const wasLiked = likesSet.has(String(id));

  if (USE_SUPABASE) {
    if (wasLiked) {
      await sb.from('likes').delete().eq('family_id', id).eq('user_id', currentUser.id);
      likesSet.delete(String(id));
      fam.likes_count = Math.max(0, (fam.likes_count||1) - 1);
    } else {
      await sb.from('likes').insert({family_id: id, user_id: currentUser.id});
      likesSet.add(String(id));
      fam.likes_count = (fam.likes_count||0) + 1;
    }
  } else {
    if (wasLiked) { likesSet.delete(String(id)); fam.likes_count = Math.max(0,(fam.likes_count||1)-1); }
    else { likesSet.add(String(id)); fam.likes_count = (fam.likes_count||0)+1; }
  }

  const btn = document.getElementById(`lkBtn_${id}`);
  const cnt = document.getElementById(`lkCnt_${id}`);
  const nowLiked = likesSet.has(String(id));
  if (btn) { btn.className = 'btnlk'+(nowLiked?' lkd':''); btn.innerHTML = `👍 ${nowLiked?'أعجبني':'إعجاب'}`; }
  if (cnt) cnt.textContent = `${fam.likes_count||0} شخص أعجبه هذا`;
  refreshMapViews(true);
}

/* ══════════════════════════════════════════════════
   ORDER
══════════════════════════════════════════════════ */
async function openOrder(familyId) {
  if (!currentUser) { showToast('⚠️ سجّل دخولك أولاً لإرسال طلب'); openAuth('login'); return; }
  currentOrderFamilyId = familyId;
  cartItems = {};
  const fam = families.find(f => String(f.id) === String(familyId));
  const prods = await loadProducts(familyId);

  document.getElementById('orderTitle').textContent = `🛒 طلب من ${fam?.name||''}`;
  const preDateInput = document.getElementById('orderPreDate');
  if (preDateInput) {
    preDateInput.min = new Date().toISOString().split('T')[0];
    preDateInput.value = '';
  }
  const preCheck = document.getElementById('orderPreCheck');
  if (preCheck) preCheck.checked = false;
  togglePreorderDate(false);
  document.getElementById('orderItems').innerHTML = prods.map(p => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bd)">
      <span style="font-size:22px">${p.emoji||'🍽️'}</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.88rem">${p.name}</div>
        <div style="font-size:.78rem;color:var(--mu)">${p.price} ر.س</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="changeCart('${p.id}',${p.price},-1)" style="width:28px;height:28px;border-radius:50%;border:1.5px solid var(--bd);background:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
        <span id="qty_${p.id}" style="font-weight:700;min-width:20px;text-align:center">0</span>
        <button onclick="changeCart('${p.id}',${p.price},1)" style="width:28px;height:28px;border-radius:50%;background:var(--p);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
      </div>
    </div>`).join('');

  updateCartSummary();
  document.getElementById('ovOrder').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function changeCart(productId, price, delta) {
  const curr = cartItems[productId]?.qty || 0;  // BUG FIX: read .qty not the whole object
  const next = Math.max(0, curr + delta);
  if (next === 0) delete cartItems[productId];
  else cartItems[productId] = {qty: next, price};
  const el = document.getElementById(`qty_${productId}`);
  if (el) el.textContent = next;
  updateCartSummary();
}

function updateCartSummary() {
  const items = Object.entries(cartItems);
  const total = items.reduce((s,[,v]) => s + v.qty * v.price, 0);
  const qty   = items.reduce((s,[,v]) => s + v.qty, 0);
  document.getElementById('orderQty').textContent   = `${qty} منتج`;
  document.getElementById('orderTotal').textContent = `${total} ر.س`;
}

function togglePreorderDate(enabled) {
  const wrap = document.getElementById('preDateWrap');
  if (wrap) wrap.style.display = enabled ? 'block' : 'none';
  if (!enabled) {
    const d = document.getElementById('orderPreDate');
    if (d) d.value = '';
  }
}

function extractPreorderDate(note) {
  const m = String(note || '').match(/\[PREORDER:([0-9]{4}-[0-9]{2}-[0-9]{2})\]/);
  return m ? m[1] : '';
}

async function submitOrder() {
  const items = Object.entries(cartItems);
  if (!items.length) { showToast('⚠️ اختر منتجاً واحداً على الأقل'); return; }
  const noteRaw  = document.getElementById('orderNote').value.trim();
  const addr  = document.getElementById('orderAddr').value.trim();
  const isPre = !!document.getElementById('orderPreCheck')?.checked;
  const preDate = document.getElementById('orderPreDate')?.value || '';
  if (isPre && !preDate) { showToast('⚠️ اختر تاريخ الطلب المسبق'); return; }
  const total = items.reduce((s,[,v]) => s + v.qty * v.price, 0);
  const preNote = isPre ? `موعد الطلب المسبق: ${preDate}` : '';
  const note = [noteRaw, preNote].filter(Boolean).join(' | ') + (isPre ? ` [PREORDER:${preDate}]` : '');

  const orderData = {
    family_id: currentOrderFamilyId,
    customer_id: currentUser.id,
    items: items.map(([id,v]) => ({product_id:id, qty:v.qty, price:v.price})),
    total, note, delivery_address: addr, status: 'pending'
  };

  setBtnLoading('orderBtn', true);
  if (USE_SUPABASE) {
    const {error} = await sb.from('orders').insert(orderData);
    if (error) { setBtnLoading('orderBtn', false); showToast('❌ حدث خطأ، حاول مجدداً'); return; }
  } else {
    orders.unshift({...orderData, id:'new-'+Date.now(), family_name: families.find(f=>f.id===currentOrderFamilyId)?.name||''});
  }
  setBtnLoading('orderBtn', false);
  closeOrder();
  showToast('✅ تم إرسال طلبك بنجاح! انتظر تأكيد الأسرة');
}

function closeOrder() {
  document.getElementById('ovOrder').classList.remove('open');
  document.body.style.overflow = '';
  const preCheck = document.getElementById('orderPreCheck');
  if (preCheck) preCheck.checked = false;
  togglePreorderDate(false);
}

/* ══════════════════════════════════════════════════
   REVIEW
══════════════════════════════════════════════════ */
function openReview(familyId) {
  if (!currentUser) { showToast('⚠️ سجّل دخولك أولاً'); openAuth('login'); return; }
  currentReviewFamilyId = familyId;
  reviewStars = 0;
  document.querySelectorAll('.star').forEach(s => s.classList.remove('lit'));
  document.getElementById('reviewBody').value = '';
  document.getElementById('ovReview').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setStars(n) {
  reviewStars = n;
  document.querySelectorAll('.star').forEach((s,i) => s.classList.toggle('lit', i < n));
}

async function submitReview() {
  if (!reviewStars) { showToast('⚠️ اختر عدد النجوم'); return; }
  const body = document.getElementById('reviewBody').value.trim();
  if (USE_SUPABASE) {
    await sb.from('reviews').insert({
      family_id: currentReviewFamilyId,
      customer_id: currentUser.id,
      rating: reviewStars, body
    });
  }
  closeReview();
  showToast('⭐ شكراً على تقييمك!');
}

function closeReview() { document.getElementById('ovReview').classList.remove('open'); document.body.style.overflow = ''; }

/* ══════════════════════════════════════════════════
   AUTH UI
══════════════════════════════════════════════════ */
function openAuth(tab='login') {
  clearAuthForms(); switchTab(tab);
  document.getElementById('ovAuth').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuth() { document.getElementById('ovAuth').classList.remove('open'); document.body.style.overflow = ''; }
function switchTab(tab) {
  document.getElementById('loginForm').style.display  = tab==='login' ? '' : 'none';
  document.getElementById('regForm').style.display    = tab==='register' ? '' : 'none';
  document.getElementById('tabLogin').classList.toggle('act', tab==='login');
  document.getElementById('tabReg').classList.toggle('act', tab==='register');
}
function clearAuthForms() {
  ['lEmail','lPass','rName','rEmail','rPass','rBiz','rPhone'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['lErr','rErr'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display='none'; });
  catSel['rCatPick'] = '';
  document.querySelectorAll('#rCatPick .co').forEach(o => o.classList.remove('sel'));
}
function pickCat(el, cat, pid) {
  document.querySelectorAll(`#${pid} .co`).forEach(o => o.classList.remove('sel'));
  el.classList.add('sel'); catSel[pid] = cat;
}

/* ══════════════════════════════════════════════════
   ADD FAMILY
══════════════════════════════════════════════════ */
function openAdd() {
  if (!currentUser) { openAuth('register'); return; }
  document.getElementById('ovAdd').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAdd() { document.getElementById('ovAdd').classList.remove('open'); document.body.style.overflow = ''; }

async function previewAddImg(input) {
  const file = input.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️ الملف يجب أن يكون صورة'); input.value=''; return; }
  const prev = document.getElementById('addImgPreview');
  const area = input.closest('.upload-area');
  prev.innerHTML = `<div style="padding:10px;font-size:.82rem;color:var(--mu)">⏳ جاري ضغط الصورة…</div>`;
  if (area) area.classList.add('uploading');
  try {
    const {blob, dataUrl, origSize, compSize} = await compressImage(file, 1200, 0.80);
    addImageFile = new File([blob], 'family-image.jpg', {type:'image/jpeg'});
    const pct = Math.round((1 - compSize / origSize) * 100);
    const badge = origSize > compSize + 10240
      ? `<div class="img-compress-badge">✅ وُفِّر ${pct}% · ${fmtKB(compSize)}</div>`
      : `<div class="img-compress-badge neutral">📎 ${fmtKB(compSize)}</div>`;
    prev.innerHTML = `<img src="${dataUrl}" class="upload-preview" alt="preview">${badge}`;
  } catch (_e) {
    prev.innerHTML = `📷<br><span style="font-size:.8rem;color:var(--mu)">تعذر معالجة الصورة</span>`;
    addImageFile = null;
    input.value = '';
  } finally {
    if (area) area.classList.remove('uploading');
  }
}

async function submitAdd() {
  const name = document.getElementById('aN').value.trim();
  const phone = document.getElementById('aP').value.trim();
  const cat = catSel['aCatPick'] || '';
  const desc = document.getElementById('aD').value.trim();
  if (!name||!phone||!cat) { showToast('⚠️ يرجى تعبئة الحقول المطلوبة'); return; }
  if (!isValidPhone(phone)) { showToast('⚠️ رقم الجوال غير صحيح'); return; }

  setBtnLoading('addFamilyBtn', true);
  try {
    let imageUrl = '';
    if (addImageFile && USE_SUPABASE) {
      const ext = addImageFile.name.split('.').pop();
      const path = `families/${currentUser.id}-${Date.now()}.${ext}`;
      const {data: uploadData} = await sb.storage.from('family-images').upload(path, addImageFile, {upsert:true});
      if (uploadData) {
        const {data: urlData} = sb.storage.from('family-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const famData = {
      name,
      phone: normalizePhone(phone),
      cat,
      desc,
      emoji: EMOJI[cat]||'🏡',
      instagram: document.getElementById('aIG').value.trim(),
      snap: document.getElementById('aSN').value.trim(),
      tiktok: document.getElementById('aTK').value.trim(),
      working_hours: [{d:'يومياً', t: document.getElementById('aH').value.trim()||'٩ص–١٠م'}],
      lat: DEF.lat + (Math.random()-.5)*.015,
      lng: DEF.lng + (Math.random()-.5)*.015,
      image_url: imageUrl,
      likes_count: 0
    };

    if (USE_SUPABASE) {
      const slug = name.replace(/\s+/g,'-')+'-'+Date.now();
      await sb.from('families').update({...famData, slug}).eq('user_id', currentUser.id);
    } else {
      const idx = families.findIndex(f => f.id === myFamily?.id);
      if (idx !== -1) families[idx] = {...families[idx], ...famData};
      else { const nf = {...famData, id:String(families.length+1)}; families.push(nf); myFamily = nf; }
      filteredFamilies = [...families];
      refreshMapViews();
    }

    closeAdd();
    showToast('✅ تم تحديث بيانات مشروعك!');
  } catch (_e) {
    showToast('❌ تعذر حفظ بيانات المشروع حالياً');
  } finally {
    setBtnLoading('addFamilyBtn', false);
  }
}

/* ══════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════ */
async function openDash() {
  if (!currentUser) { openAuth('login'); return; }
  showLoading(true);
  await loadOrders();
  showLoading(false);
  document.getElementById('ovDash').classList.add('open');
  document.body.style.overflow = 'hidden';
  buildDash('overview');
}
function closeDash() { document.getElementById('ovDash').classList.remove('open'); document.body.style.overflow = ''; }

async function buildDash(tab) {
  if (!currentUser) return;
  const fam = myFamily || families.find(f => f.id === (currentUser.familyId||''));
  const myLks = fam ? (fam.likes_count||0) : 0;
  const totalLks = families.reduce((s,f) => s + (f.likes_count||0), 0);
  const sorted = [...families].sort((a,b) => (b.likes_count||0)-(a.likes_count||0));
  const cats = {}; families.forEach(f => { cats[f.cat]=(cats[f.cat]||0)+1; });
  const catMax = Math.max(...Object.values(cats), 1);
  const rCls = i => ['gld','slv','brz','nrm','nrm'][Math.min(i,4)];
  const spark = [40,65,55,80,72,90,85], spMax = 90;
  const days = ['س','أ','ث','ر','خ','ج','س'];
  const bClrs = ['#6366F1','#818CF8','#6366F1','#818CF8','#6366F1','#A5B4FC','#6366F1'];

  const pendingOrders = orders.filter(o => o.status==='pending').length;
  const doneOrders    = orders.filter(o => o.status==='done').length;
  const totalRevenue  = orders.filter(o=>o.status==='done').reduce((s,o)=>s+(o.total||0),0);

  let body = '';

  // ── OVERVIEW TAB
  if (tab === 'overview') {
    const rtBadge = USE_SUPABASE ? `<span class="rt-badge"><span class="rt-dot"></span> مباشر</span>` : '';
    body = `
      <div class="kgrid">
        <div class="kpi ki"><div class="kic">🏡</div><div class="kv">${families.length}</div><div class="kl">أسرة مسجّلة</div>${rtBadge}</div>
        <div class="kpi kg"><div class="kic">👍</div><div class="kv">${totalLks}</div><div class="kl">إجمالي الإعجابات</div><div class="ktr up">▲ يُحدَّث لحظياً</div></div>
        <div class="kpi ko"><div class="kic">❤️</div><div class="kv">${myLks}</div><div class="kl">إعجابات مشروعي</div></div>
        <div class="kpi km"><div class="kic">📦</div><div class="kv">${orders.length}</div><div class="kl">إجمالي الطلبات</div></div>
      </div>
      <div class="dstit">الزيارات الأسبوعية <span></span></div>
      <div class="bchart">${spark.map((v,i)=>`<div class="bcol"><div class="bfill" style="height:${Math.round(v/spMax*100)}%;background:${bClrs[i]}"></div><div class="blbl">${days[i]}</div></div>`).join('')}</div>
      <div style="margin-bottom:18px;font-size:.67rem;color:#475569;text-align:center">آخر 7 أيام</div>
      <div class="dstit">🏆 أكثر الأسر إعجاباً <span></span></div>
      <div style="margin-bottom:18px">
        ${sorted.slice(0,5).map((f,i)=>`
          <div class="trow" onclick="closeDash();openProfile('${f.id}')">
            <div class="rank ${rCls(i)}">${i+1}</div>
            <div class="tav" style="background:${(CATS[f.cat]||{}).bg||'#f0f0f0'}">${f.emoji}</div>
            <div class="ti"><div class="tnm">${f.name}</div><div class="tct">${(CATS[f.cat]||{}).label||f.cat}</div></div>
            <div class="tlk">👍 ${f.likes_count||0}</div>
          </div>`).join('')}
      </div>
      <div class="dstit">آخر النشاطات <span></span></div>
      <div class="afeed">
        ${fam ? `<div class="aitem an"><div class="adot an"></div><div><div class="atxt">مشروعك <strong>${fam.name}</strong> — ${myLks} إعجاب حتى الآن</div><div class="atm">الآن</div></div></div>` : ''}
        ${pendingOrders ? `<div class="aitem al"><div class="adot al"></div><div><div class="atxt"><strong>${pendingOrders} طلب</strong> ينتظر موافقتك</div><div class="atm">الآن</div></div></div>` : ''}
        <div class="aitem ar"><div class="adot ar"></div><div><div class="atxt">${families.length} أسرة مسجّلة على المنصة</div><div class="atm">إجمالي</div></div></div>
      </div>`;
  }

  // ── ORDERS TAB
  if (tab === 'orders') {
    body = `
      <div class="kgrid" style="margin-bottom:18px">
        <div class="kpi kg"><div class="kic">📦</div><div class="kv">${orders.length}</div><div class="kl">إجمالي الطلبات</div></div>
        <div class="kpi ko"><div class="kic">✅</div><div class="kv">${doneOrders}</div><div class="kl">طلب مكتمل</div></div>
        <div class="kpi ki"><div class="kic">⏳</div><div class="kv">${pendingOrders}</div><div class="kl">قيد الانتظار</div></div>
        <div class="kpi km"><div class="kic">💰</div><div class="kv">${totalRevenue}</div><div class="kl">ريال إيرادات</div></div>
      </div>
      <div class="dstit">الطلبات <span></span></div>
      <div style="overflow-x:auto">
        <table class="otable">
          <thead><tr><th>الأسرة</th><th>الإجمالي</th><th>الحالة</th><th>الإجراء</th></tr></thead>
          <tbody>${orders.slice(0,10).map(o=>`
            <tr>
              <td>${o.family_name||'—'}${extractPreorderDate(o.note) ? `<div style="margin-top:3px;font-size:.66rem;color:#A5B4FC">📅 ${extractPreorderDate(o.note)}</div>` : ''}</td>
              <td style="font-weight:700;color:#F59E0B">${o.total||0} ر.س</td>
              <td><span class="ostatus ${ST_CLS[o.status]||'os-p'}">${ST_LABEL[o.status]||o.status}</span></td>
              <td>${o.status==='pending'?`<button onclick="updateOrderStatus('${o.id}','confirmed')" style="background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#818CF8;border-radius:6px;padding:3px 9px;font-size:.7rem;cursor:pointer;font-family:'Tajawal',sans-serif;">تأكيد</button>`:'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // ── PRODUCTS TAB
  if (tab === 'products') {
    const famProds = fam ? (products[String(fam.id)] || SEED_PRODUCTS[String(fam.id)] || []) : [];
    const prodRows = famProds.length
      ? famProds.map(it=>`
          <div class="pcard">
            <div class="pem">${it.emoji||'🍽️'}</div>
            <div class="pnm">${it.name}</div>
            <div class="pds">${it.desc||''}</div>
            <div class="ppr">${it.price} ر.س</div>
            <div class="pack">
              <button class="pbtn" onclick="openEditProduct('${fam?.id}','${it.id}')">✏️ تعديل</button>
              <button class="pbtn" onclick="deleteProduct('${fam?.id}','${it.id}')">🗑️ حذف</button>
            </div>
          </div>`).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:18px;color:#475569;font-size:.83rem">لا توجد منتجات بعد</div>`;

    body = `
      ${fam ? `
        <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:var(--r);padding:13px;margin-bottom:16px;display:flex;align-items:center;gap:13px;flex-wrap:wrap">
          <div style="width:46px;height:46px;border-radius:11px;background:${(CATS[fam.cat]||{}).bg||'#f0f0f0'};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${fam.emoji}</div>
          <div style="flex:1;min-width:0">
            <div style="font-family:'Cairo',sans-serif;font-weight:800;font-size:.94rem;color:#E2E8F0">${fam.name}</div>
            <div style="font-size:.72rem;color:#64748B;margin-top:1px">${(CATS[fam.cat]||{}).label||fam.cat} · ${fam.phone||''}</div>
          </div>
          <button onclick="closeDash();openProfile('${fam.id}')" style="padding:5px 11px;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.35);color:#818CF8;border-radius:50px;font-size:.74rem;font-weight:700;cursor:pointer;font-family:'Tajawal',sans-serif;flex-shrink:0">عرض البروفايل</button>
        </div>` : ''}
      <div class="kgrid" style="margin-bottom:14px">
        <div class="kpi kg"><div class="kic">👍</div><div class="kv">${myLks}</div><div class="kl">إعجابات مشروعي</div></div>
        <div class="kpi ki"><div class="kic">🍽️</div><div class="kv">${famProds.length}</div><div class="kl">عدد المنتجات</div></div>
      </div>
      <div class="dstit">منتجاتي <span></span></div>
      <div id="addProdForm" style="display:none">
        <div class="prod-form">
          <div class="fg">
            <label class="fl">صورة المنتج (اختياري)</label>
            <div class="upload-area" onclick="document.getElementById('pf_img_input').click()">
              <div id="pf_img_preview">📷<br><span style="font-size:.78rem;color:#94A3B8">اضغط لرفع صورة المنتج</span></div>
              <input type="file" id="pf_img_input" accept="image/*" onchange="previewProductImg(this)">
            </div>
          </div>
          <div class="fg"><label class="fl">اسم المنتج *</label><input class="fi" type="text" id="pf_name" placeholder="مثال: كنافة بالجبن"></div>
          <div class="fg"><label class="fl">السعر (ريال) *</label><input class="fi" type="number" id="pf_price" placeholder="50"></div>
          <div class="fg"><label class="fl">رمز (إيموجي)</label><input class="fi" type="text" id="pf_emoji" placeholder="🍰" maxlength="4"></div>
          <div class="fg"><label class="fl">وصف مختصر</label><textarea class="fta" id="pf_desc" placeholder="وصف المنتج..."></textarea></div>
          <button class="prod-save-btn" onclick="saveProduct('${fam?.id}')">💾 حفظ المنتج</button>
        </div>
      </div>
      <button class="btn-addp" onclick="toggleAddProdForm()">＋ إضافة منتج جديد</button>
      <div class="pgrid">${prodRows}</div>`;
  }

  // ── STATS TAB
  if (tab === 'stats') {
    body = `
      <div class="dstit">توزيع الأسر حسب الفئة <span></span></div>
      <div class="cbars">${Object.entries(cats).map(([cat,cnt])=>{
        const pct=Math.round((cnt/catMax)*100);
        return `<div class="cbrow"><div class="cblbl">${(CATS[cat]||{}).label||cat}</div><div class="cbtrack"><div class="cbfill" style="width:0%;background:${CAT_C[cat]||'#6366F1'}" data-t="${pct}%">${cnt>1?cnt:''}</div></div><div class="cbcnt">${cnt}</div></div>`;
      }).join('')}</div>
      <div class="dstit">أعلى 5 أسر إعجاباً <span></span></div>
      ${sorted.slice(0,5).map((f,i)=>`
        <div class="trow" onclick="closeDash();openProfile('${f.id}')">
          <div class="rank ${rCls(i)}">${i+1}</div>
          <div class="tav" style="background:${(CATS[f.cat]||{}).bg||'#f0f0f0'}">${f.emoji}</div>
          <div class="ti"><div class="tnm">${f.name}</div><div class="tct">${(CATS[f.cat]||{}).label||f.cat}</div></div>
          <div class="tlk">👍 ${f.likes_count||0}</div>
        </div>`).join('')}`;
  }

  // ── OFFERS TAB
  if (tab === 'offers') {
    const famOffers = fam ? (await loadOffers(fam.id)) : [];
    const rows = famOffers.length
      ? famOffers.map(o => {
          const offVal = o.discount_type === 'fixed' ? `${o.discount_val} ر.س` : `${o.discount_val}%`;
          const exp = o.expires_at ? new Date(o.expires_at).toLocaleDateString('ar-SA') : '—';
          return `<div class="pcard"><div class="pnm">🎁 ${o.title}</div><div class="pds">${o.desc||'بدون وصف'}</div><div class="ppr">خصم ${offVal}</div><div class="pds">الكوبون: ${o.code || 'بدون'}</div><div class="pds">الانتهاء: ${exp}</div><div class="pack"><button class="pbtn" onclick="deleteOffer('${fam?.id}','${o.id}')">🗑️ حذف</button></div></div>`;
        }).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:18px;color:#475569;font-size:.83rem">لا توجد عروض بعد</div>`;

    body = `
      <div class="dstit">إضافة عرض جديد <span></span></div>
      <div class="prod-form" style="margin-bottom:14px">
        <div class="fg"><label class="fl">عنوان العرض *</label><input class="fi" type="text" id="of_title" placeholder="مثال: خصم نهاية الأسبوع"></div>
        <div class="fg"><label class="fl">الوصف</label><textarea class="fta" id="of_desc" placeholder="تفاصيل العرض..."></textarea></div>
        <div class="fg"><label class="fl">نوع الخصم *</label><select class="fsel" id="of_type"><option value="percent">نسبة مئوية %</option><option value="fixed">مبلغ ثابت (ر.س)</option></select></div>
        <div class="fg"><label class="fl">قيمة الخصم *</label><input class="fi" type="number" id="of_val" placeholder="15"></div>
        <div class="fg"><label class="fl">كود الكوبون</label><input class="fi" type="text" id="of_code" placeholder="SAVE15"></div>
        <div class="fg"><label class="fl">تاريخ الانتهاء (اختياري)</label><input class="fi" type="date" id="of_exp"></div>
        <button class="prod-save-btn" id="saveOfferBtn" onclick="saveOffer('${fam?.id}')">💾 حفظ العرض</button>
      </div>
      <div class="dstit">عروضي <span></span></div>
      <div class="pgrid">${rows}</div>`;
  }

  const uName = currentUser.user_metadata?.name || currentUser.email || 'المستخدم';
  document.getElementById('dashWrap').innerHTML = `
    <div class="dtop">
      <div><div class="dh">📊 لوحة التحكم</div><div class="dsb">أهلاً ${uName}${fam?' · '+fam.name:''}</div></div>
      <span class="drole">مسجّل ✓</span>
    </div>
    <div class="dtabs">
      <button class="dtab${tab==='overview'?' act':''}" onclick="buildDash('overview')">نظرة عامة</button>
      <button class="dtab${tab==='orders'?' act':''}" onclick="buildDash('orders')">الطلبات${pendingOrders?` (${pendingOrders})`:''}</button>
      <button class="dtab${tab==='products'?' act':''}" onclick="buildDash('products')">منتجاتي</button>
      <button class="dtab${tab==='offers'?' act':''}" onclick="buildDash('offers')">العروض</button>
      <button class="dtab${tab==='stats'?' act':''}" onclick="buildDash('stats');setTimeout(animCBars,100)">إحصائيات</button>
    </div>
    ${body}`;

  if (tab==='stats') setTimeout(animCBars,100);
}

function animCBars() { document.querySelectorAll('.cbfill').forEach(b=>{ if(b.dataset.t) b.style.width=b.dataset.t; }); }

function toggleAddProdForm() {
  const f = document.getElementById('addProdForm');
  f.style.display = f.style.display==='none' ? 'block' : 'none';
  if (f.style.display === 'none') resetProductImgField();
}

async function previewProductImg(input) {
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️ الملف يجب أن يكون صورة'); input.value=''; return; }
  const prev = document.getElementById('pf_img_preview');
  const area = input.closest('.upload-area');
  prev.innerHTML = `<div style="padding:10px;font-size:.78rem;color:#94A3B8">⏳ جاري ضغط الصورة…</div>`;
  if (area) area.classList.add('uploading');
  try {
    const {blob, dataUrl, origSize, compSize} = await compressImage(file, 800, 0.78);
    prodImageFile = new File([blob], 'product-image.jpg', {type:'image/jpeg'});
    const pct = Math.round((1 - compSize / origSize) * 100);
    const badge = origSize > compSize + 10240
      ? `<div class="img-compress-badge">✅ وُفِّر ${pct}% · ${fmtKB(compSize)}</div>`
      : `<div class="img-compress-badge neutral">📎 ${fmtKB(compSize)}</div>`;
    prev.innerHTML = `<img src="${dataUrl}" class="upload-preview" alt="product preview">${badge}`;
  } catch (_e) {
    prev.innerHTML = `📷<br><span style="font-size:.78rem;color:#94A3B8">تعذر معالجة الصورة</span>`;
    prodImageFile = null;
    input.value = '';
  } finally {
    if (area) area.classList.remove('uploading');
  }
}

function resetProductImgField() {
  prodImageFile = null;
  const input = document.getElementById('pf_img_input');
  if (input) input.value = '';
  const preview = document.getElementById('pf_img_preview');
  if (preview) preview.innerHTML = `📷<br><span style="font-size:.78rem;color:#94A3B8">اضغط لرفع صورة المنتج</span>`;
}

function fmtKB(bytes) {
  return bytes >= 1048576 ? (bytes/1048576).toFixed(1)+' MB' : Math.round(bytes/1024)+' KB';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  return digits;
}

function isValidPhone(phone) {
  const digits = normalizePhone(phone).replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image load error'));
      img.onload = () => {
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > maxDim || h > maxDim) {
          if (w >= h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          const safeBlob = blob || file;
          resolve({
            blob: safeBlob,
            dataUrl: canvas.toDataURL('image/jpeg', quality),
            origSize: file.size,
            compSize: safeBlob.size
          });
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function saveProduct(familyId) {
  if (!familyId) {
    showToast('⚠️ لا توجد أسرة مرتبطة بالحساب');
    return;
  }
  const name  = document.getElementById('pf_name').value.trim();
  const price = parseFloat(document.getElementById('pf_price').value);
  const emoji = document.getElementById('pf_emoji').value.trim() || '🍽️';
  const desc  = document.getElementById('pf_desc').value.trim();
  if (!name || !price) { showToast('⚠️ اسم المنتج والسعر مطلوبان'); return; }
  if (price <= 0) { showToast('⚠️ السعر يجب أن يكون أكبر من صفر'); return; }

  let imageUrl = '';
  if (prodImageFile) {
    if (USE_SUPABASE) {
      const extRaw = (prodImageFile.name.split('.').pop() || 'jpg').toLowerCase();
      const ext = /^[a-z0-9]+$/.test(extRaw) ? extRaw : 'jpg';
      const basePath = `${familyId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

      let bucket = 'product-images';
      let uploadPath = basePath;
      let upload = await sb.storage.from(bucket).upload(uploadPath, prodImageFile, {upsert:false});

      if (upload.error) {
        // Fallback for setups that only created one storage bucket.
        bucket = 'family-images';
        uploadPath = `products/${basePath}`;
        upload = await sb.storage.from(bucket).upload(uploadPath, prodImageFile, {upsert:false});
      }

      if (!upload.error) {
        const {data:urlData} = sb.storage.from(bucket).getPublicUrl(uploadPath);
        imageUrl = urlData?.publicUrl || '';
      } else {
        showToast('⚠️ تعذر رفع الصورة، سيتم حفظ المنتج بدون صورة');
      }
    } else {
      imageUrl = await fileToDataUrl(prodImageFile);
    }
  }

  const prod = {
    family_id: familyId,
    name,
    price,
    emoji,
    desc,
    image_url: imageUrl,
    in_stock: true,
    sort_order: (products[familyId]?.length||0)+1
  };
  try {
    if (USE_SUPABASE) {
      const {data, error} = await sb.from('products').insert(prod).select().single();
      if (error) throw error;
      if (!products[familyId]) products[familyId] = [];
      products[familyId].push(data);
    } else {
      const p = {...prod, id:'new-'+Date.now()};
      if (!products[familyId]) products[familyId] = [];
      products[familyId].push(p);
    }
    showToast('✅ تم إضافة المنتج!');
    resetProductImgField();
    buildDash('products');
  } catch (_e) {
    showToast('❌ تعذر حفظ المنتج حالياً');
  }
}

async function saveOffer(familyId) {
  if (!familyId) { showToast('⚠️ لا توجد أسرة مرتبطة بالحساب'); return; }
  const title = document.getElementById('of_title')?.value.trim();
  const desc = document.getElementById('of_desc')?.value.trim() || '';
  const type = document.getElementById('of_type')?.value || 'percent';
  const val = parseFloat(document.getElementById('of_val')?.value);
  const code = (document.getElementById('of_code')?.value || '').trim().toUpperCase();
  const exp = document.getElementById('of_exp')?.value || '';

  if (!title || !val || val <= 0) { showToast('⚠️ العنوان وقيمة الخصم مطلوبان'); return; }
  if (type === 'percent' && val > 100) { showToast('⚠️ نسبة الخصم لا تتجاوز 100%'); return; }

  setBtnLoading('saveOfferBtn', true);
  try {
    const offer = {
      family_id: familyId,
      title,
      desc,
      discount_type: type,
      discount_val: val,
      code: code || null,
      expires_at: exp ? `${exp}T23:59:59` : null,
      is_active: true
    };

    if (USE_SUPABASE) {
      const {data, error} = await sb.from('offers').insert(offer).select().single();
      if (error) throw error;
      if (!offersByFamily[String(familyId)]) offersByFamily[String(familyId)] = [];
      offersByFamily[String(familyId)].unshift(data);
    } else {
      const local = {...offer, id: `local-offer-${Date.now()}`};
      if (!offersByFamily[String(familyId)]) offersByFamily[String(familyId)] = [];
      offersByFamily[String(familyId)].unshift(local);
    }

    ['of_title','of_desc','of_val','of_code','of_exp'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const typeEl = document.getElementById('of_type');
    if (typeEl) typeEl.value = 'percent';
    showToast('✅ تم حفظ العرض');
    buildDash('offers');
  } catch (_e) {
    showToast('❌ تعذر حفظ العرض حالياً');
  } finally {
    setBtnLoading('saveOfferBtn', false);
  }
}

async function deleteOffer(familyId, offerId) {
  if (!confirm('هل تريد حذف هذا العرض؟')) return;
  try {
    if (USE_SUPABASE) {
      const {error} = await sb.from('offers').delete().eq('id', offerId).eq('family_id', familyId);
      if (error) throw error;
    }
    if (offersByFamily[String(familyId)]) {
      offersByFamily[String(familyId)] = offersByFamily[String(familyId)].filter(o => String(o.id) !== String(offerId));
    }
    showToast('🗑️ تم حذف العرض');
    buildDash('offers');
  } catch (_e) {
    showToast('❌ تعذر حذف العرض حالياً');
  }
}

function hydrateSettings() {
  const fullName = currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || '';
  const familyName = myFamily?.name || '';
  const phone = myFamily?.phone || currentUser?.user_metadata?.phone || '';
  const hours = myFamily?.working_hours?.[0]?.t || '٩ص–١٠م';
  const ig = myFamily?.instagram || '';
  document.getElementById('sName').value = fullName;
  document.getElementById('sEmail').value = currentUser?.email || '';
  document.getElementById('sPhone').value = phone;
  document.getElementById('sBiz').value = familyName;
  document.getElementById('sHours').value = hours;
  document.getElementById('sIG').value = ig;
  document.getElementById('sPass').value = '';
  const conn = document.getElementById('settingsConnState');
  if (conn) {
    conn.style.color = USE_SUPABASE ? 'var(--ok)' : 'var(--warn)';
    conn.textContent = USE_SUPABASE ? 'متصل بـ Supabase' : 'وضع تجريبي';
  }
}

async function saveSettings() {
  if (!currentUser) { openAuth('login'); return; }
  const name = document.getElementById('sName').value.trim();
  const phone = document.getElementById('sPhone').value.trim();
  const biz = document.getElementById('sBiz').value.trim();
  const hours = document.getElementById('sHours').value.trim() || '٩ص–١٠م';
  const instagram = document.getElementById('sIG').value.trim();
  const pass = document.getElementById('sPass').value;

  if (!name || !biz) { showToast('⚠️ الاسم واسم المشروع مطلوبان'); return; }
  if (phone && !isValidPhone(phone)) { showToast('⚠️ رقم الجوال غير صحيح'); return; }
  if (pass && pass.length < 6) { showToast('⚠️ كلمة المرور الجديدة قصيرة'); return; }

  setBtnLoading('saveSettingsBtn', true);
  try {
    if (USE_SUPABASE) {
      const {error: upErr} = await sb.auth.updateUser({
        password: pass || undefined,
        data: {name, phone: normalizePhone(phone)}
      });
      if (upErr) throw upErr;

      if (myFamily?.id) {
        const {error: famErr} = await sb.from('families').update({
          name: biz,
          phone: normalizePhone(phone),
          instagram,
          working_hours: [{d:'يومياً', t: hours}]
        }).eq('id', myFamily.id);
        if (famErr) throw famErr;
      }
      await loadData();
      await loadMyFamily();
    } else {
      currentUser.user_metadata = {...(currentUser.user_metadata||{}), name, phone: normalizePhone(phone)};
      if (myFamily) {
        myFamily.name = biz;
        myFamily.phone = normalizePhone(phone);
        myFamily.instagram = instagram;
        myFamily.working_hours = [{d:'يومياً', t: hours}];
        const idx = families.findIndex(f => f.id === myFamily.id);
        if (idx !== -1) families[idx] = {...myFamily};
      }
      filteredFamilies = [...families];
    }
    updateAuthArea();
    refreshMapViews(true);
    showToast('✅ تم حفظ الإعدادات بنجاح');
  } catch (_e) {
    showToast('❌ تعذر حفظ الإعدادات حالياً');
  } finally {
    setBtnLoading('saveSettingsBtn', false);
  }
}

async function deleteProduct(familyId, productId) {
  if (!confirm('هل تريد حذف هذا المنتج؟')) return;
  if (USE_SUPABASE) await sb.from('products').delete().eq('id', productId);
  if (products[familyId]) products[familyId] = products[familyId].filter(p => String(p.id) !== String(productId));
  showToast('🗑️ تم حذف المنتج');
  buildDash('products');
}

function openEditProduct(familyId, productId) {
  showToast('✏️ ميزة التعديل — قريباً');
}

async function updateOrderStatus(orderId, status) {
  if (USE_SUPABASE) {
    await sb.from('orders').update({status}).eq('id', orderId);
  }
  const o = orders.find(x => x.id === orderId);
  if (o) o.status = status;
  buildDash('orders');
  showToast('✅ تم تحديث حالة الطلب');
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function updateHeroCount() {
  const el = document.getElementById('heroCount');
  if (el) el.textContent = families.length + '+';
}

function showLoading(v) {
  document.getElementById('loadingOverlay').classList.toggle('show', v);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function showErr(el, msg) { el.textContent = msg; el.style.display = 'block'; }

function setBtnLoading(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
  btn.disabled = loading;
  if (loading) btn.innerHTML = `<span class="spin"></span>`;
  else btn.innerHTML = btn.dataset.label;
}

/* ══════════════════════════════════════════════════
   EXPOSE GLOBALS — required for HTML inline onclick handlers
   (app.js runs as ES module; functions are not on window by default)
══════════════════════════════════════════════════ */
Object.assign(window, {
  goPage, openAuth, closeAuth, switchTab, pickCat,
  openAdd, closeAdd, previewAddImg, submitAdd,
  filterBy, onSearchInput, locateUser,
  openDash, closeDash, buildDash,
  openSettings, saveSettings, doLogin, doRegister, doLogout,
  openProfile, closeProfile, copyProfileLink, toggleLike,
  openOrder, closeOrder, changeCart, togglePreorderDate, submitOrder,
  openReview, closeReview, setStars, submitReview,
  updateOrderStatus, toggleAddProdForm, previewProductImg,
  saveProduct, saveOffer, deleteOffer, deleteProduct, openEditProduct,
  openNotifications, closeNotifications, markRead, markAllRead
});
