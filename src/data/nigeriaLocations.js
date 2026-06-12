// Complete list of Nigerian states and their major cities/towns
// Used for the location dropdowns on Register and Settings pages

const NIGERIA_LOCATIONS = {
    "Abia": [
        "Aba", "Umuahia", "Arochukwu", "Bende", "Isuikwuato",
        "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West",
        "Isiala Ngwa North", "Isiala Ngwa South"
    ],
    "Adamawa": [
        "Yola", "Mubi", "Jimeta", "Numan", "Ganye", "Gombi",
        "Guyuk", "Hong", "Lamurde", "Maiha", "Mayo-Belwa",
        "Michika", "Shelleng", "Song", "Toungo"
    ],
    "Akwa Ibom": [
        "Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Etinan",
        "Ibeno", "Itu", "Mkpat Enin", "Nsit Atai", "Nsit Ibom",
        "Oruk Anam", "Uruan", "Ikot Abasi"
    ],
    "Anambra": [
        "Awka", "Onitsha", "Nnewi", "Ekwulobia", "Agulu",
        "Ihiala", "Njikoka", "Ogbaru", "Oyi",
        "Idemili North", "Idemili South", "Dunukofia"
    ],
    "Bauchi": [
        "Bauchi", "Azare", "Misau", "Katagum", "Alkaleri",
        "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa",
        "Ganjuwa", "Giade", "Itas-Gadau", "Kirfi",
        "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"
    ],
    "Bayelsa": [
        "Yenagoa", "Brass", "Ekeremor", "Kolokuma-Opokuma",
        "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Oporoma"
    ],
    "Benue": [
        "Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Adoka",
        "Ado", "Agatu", "Apa", "Buruku", "Guma",
        "Gwer East", "Gwer West", "Konshisha", "Kwande", "Logo",
        "Ohimini", "Oju", "Okpokwu", "Obi", "Tarka",
        "Ukum", "Ushongo", "Vandeikya"
    ],
    "Borno": [
        "Maiduguri", "Bama", "Biu", "Dikwa", "Askira-Uba",
        "Chibok", "Damboa", "Gwoza", "Hawul", "Jere",
        "Kaga", "Konduga", "Kukawa", "Mafa", "Magumeri",
        "Mobbar", "Monguno", "Ngala", "Shani"
    ],
    "Cross River": [
        "Calabar", "Ikom", "Ogoja", "Akamkpa", "Akpabuyo",
        "Bekwarra", "Biase", "Boki", "Etung", "Obanliku",
        "Obubra", "Obudu", "Odukpani", "Yakurr", "Yala"
    ],
    "Delta": [
        "Asaba", "Warri", "Sapele", "Ughelli", "Agbor",
        "Abraka", "Bomadi", "Burutu", "Isoko North", "Isoko South",
        "Ndokwa East", "Ndokwa West", "Okpe", "Patani", "Uvwie",
        "Oshimili North", "Oshimili South", "Ukwuani"
    ],
    "Ebonyi": [
        "Abakaliki", "Afikpo North", "Afikpo South", "Onueke",
        "Ezza North", "Ezza South", "Ikwo", "Ishielu",
        "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ],
    "Edo": [
        "Benin City", "Auchi", "Ekpoma", "Uromi", "Egor",
        "Esan Central", "Esan North East", "Esan South East",
        "Esan West", "Etsako Central", "Etsako East", "Etsako West",
        "Igueben", "Ikpoba Okha", "Orhionmwon",
        "Owan East", "Owan West", "Uhunmwonde"
    ],
    "Ekiti": [
        "Ado Ekiti", "Ikere Ekiti", "Ilawe Ekiti", "Ijero Ekiti",
        "Ise Ekiti", "Emure Ekiti", "Efon Alaaye", "Gbonyin",
        "Ido Osi", "Ikole", "Ilejemeje", "Irepodun", "Moba", "Oye"
    ],
    "Enugu": [
        "Enugu", "Nsukka", "Agbani", "Awgu", "Aninri",
        "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South",
        "Isi Uzo", "Nkanu East", "Nkanu West",
        "Oji River", "Udenu", "Udi", "Uzo Uwani"
    ],
    "FCT Abuja": [
        "Abuja", "Gwagwalada", "Kuje", "Abaji",
        "Bwari", "Kwali", "Lugbe", "Kubwa"
    ],
    "Gombe": [
        "Gombe", "Kumo", "Dukku", "Funakaye", "Akko",
        "Balanga", "Billiri", "Kaltungo", "Kwami",
        "Nafada", "Shomgom", "Yamaltu-Deba"
    ],
    "Imo": [
        "Owerri", "Orlu", "Okigwe", "Oguta", "Ahiazu-Mbaise",
        "Ehime-Mbano", "Ezinihitte Mbaise", "Ideato North",
        "Ideato South", "Ihitte-Uboma", "Ikeduru", "Isiala-Mbano",
        "Isu", "Mbaitoli", "Ngor-Okpala", "Njaba",
        "Nkwerre", "Nwangele", "Obowo", "Ohaji-Egbema",
        "Onuimo", "Orsu"
    ],
    "Jigawa": [
        "Dutse", "Hadejia", "Gumel", "Kazaure", "Auyo",
        "Babura", "Birnin Kudu", "Buji", "Garki", "Gagarawa",
        "Guri", "Gwiwa", "Gwaram", "Jahun", "Kafin Hausa",
        "Kaugama", "Kiri Kasama", "Kiyawa", "Maigatari",
        "Malam Madori", "Miga", "Ringim", "Roni",
        "Sule-Tankarkar", "Taura", "Yankwashi"
    ],
    "Kaduna": [
        "Kaduna", "Zaria", "Kafanchan", "Kagoro",
        "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara",
        "Jaba", "Kachia", "Kagarko", "Kajuru", "Kaura",
        "Kauru", "Kubau", "Kudan", "Lere", "Makarfi",
        "Sabon Gari", "Sanga", "Soba", "Zangon Kataf"
    ],
    "Kano": [
        "Kano", "Wudil", "Bichi", "Dambatta", "Ajingi",
        "Albasu", "Bagwai", "Bebeji", "Bunkure", "Gaya",
        "Gezawa", "Gwarzo", "Kabo", "Karaye", "Kibiya",
        "Kiru", "Kunchi", "Kura", "Madobi", "Makoda",
        "Minjibir", "Rano", "Rimin Gado", "Rogo", "Shanono",
        "Sumaila", "Takai", "Tofa", "Tsanyawa",
        "Tudun Wada", "Ungogo", "Warawa"
    ],
    "Katsina": [
        "Katsina", "Daura", "Funtua", "Malumfashi", "Bakori",
        "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi",
        "Dan Musa", "Dandume", "Danja", "Dutsi", "Dutsin-Ma",
        "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara",
        "Kankia", "Kurfi", "Kusada", "Mai Adua", "Mani",
        "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa",
        "Safana", "Sandamu", "Zango"
    ],
    "Kebbi": [
        "Birnin Kebbi", "Argungu", "Yelwa", "Kamba", "Aliero",
        "Arewa Dandi", "Augie", "Bagudo", "Bunza", "Dandi",
        "Fakai", "Gwandu", "Jega", "Kalgo", "Koko-Besse",
        "Maiyama", "Ngaski", "Shanga", "Suru",
        "Wasagu-Danko", "Yauri", "Zuru"
    ],
    "Kogi": [
        "Lokoja", "Okene", "Kabba", "Idah", "Adavi",
        "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji",
        "Igalamela-Odolu", "Ijumu", "Mopa-Muro", "Ofu",
        "Ogori-Magongo", "Okehi", "Olamaboro",
        "Omala", "Yagba East", "Yagba West"
    ],
    "Kwara": [
        "Ilorin", "Offa", "Patigi", "Lafiagi", "Asa",
        "Baruten", "Edu", "Ifelodun", "Ilorin East",
        "Ilorin South", "Ilorin West", "Irepodun",
        "Isin", "Kaiama", "Moro", "Oke Ero", "Oyun"
    ],
    "Lagos": [
        "Lagos Island", "Ikeja", "Badagry", "Epe", "Ikorodu",
        "Lekki", "Surulere", "Mushin", "Oshodi", "Agege",
        "Ifako-Ijaiye", "Kosofe", "Shomolu", "Eti-Osa",
        "Lagos Mainland", "Apapa", "Ajeromi-Ifelodun",
        "Amuwo-Odofin", "Ojo", "Alimosho", "Ibeju-Lekki"
    ],
    "Nasarawa": [
        "Lafia", "Keffi", "Akwanga", "Nasarawa", "Awe",
        "Doma", "Keana", "Kokona", "Nasarawa Eggon",
        "Obi", "Toto", "Wamba"
    ],
    "Niger": [
        "Minna", "Suleja", "Bida", "Kontagora", "Agaie",
        "Agwara", "Borgu", "Bosso", "Chanchaga", "Edati",
        "Gbako", "Gurara", "Katcha", "Lapai", "Lavun",
        "Magama", "Mariga", "Mashegu", "Mokwa", "Munya",
        "Paikoro", "Rafi", "Rijau", "Shiroro", "Wushishi"
    ],
    "Ogun": [
        "Abeokuta", "Sagamu", "Ijebu Ode", "Ilaro", "Ifo",
        "Ado Odo-Ota", "Ewekoro", "Ijebu East", "Ijebu North",
        "Ijebu North East", "Ikenne", "Imeko Afon", "Ipokia",
        "Obafemi Owode", "Odeda", "Odogbolu",
        "Remo North", "Yewa North", "Yewa South"
    ],
    "Ondo": [
        "Akure", "Ondo", "Owo", "Ikare", "Okitipupa",
        "Irele", "Idanre", "Ifedore", "Ilaje",
        "Ile Oluji-Okeigbo", "Odigbo", "Ose"
    ],
    "Osun": [
        "Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo",
        "Ikirun", "Ejigbo", "Ila", "Iragbiji", "Ikire",
        "Gbongan", "Ife North", "Ife East", "Ife Central",
        "Ife South", "Ifedayo", "Ifelodun", "Irepodun",
        "Irewole", "Isokan", "Obokun", "Odo-Otin",
        "Ola Oluwa", "Olorunda", "Oriade", "Orolu"
    ],
    "Oyo": [
        "Ibadan", "Oyo", "Ogbomoso", "Iseyin", "Saki",
        "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda",
        "Ibarapa Central", "Ibarapa East", "Ibarapa North",
        "Ido", "Irepo", "Itesiwaju", "Iwajowa", "Kajola",
        "Lagelu", "Ogbomoso North", "Ogbomoso South",
        "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara",
        "Orelope", "Ori Ire", "Oyo East", "Oyo West",
        "Saki East", "Saki West", "Surulere"
    ],
    "Plateau": [
        "Jos", "Bukuru", "Shendam", "Pankshin", "Barkin Ladi",
        "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South",
        "Kanam", "Kanke", "Langtang North", "Langtang South",
        "Mangu", "Mikang", "Riyom", "Wase"
    ],
    "Rivers": [
        "Port Harcourt", "Bonny", "Degema", "Ahoada", "Buguma",
        "Abua-Odual", "Ahoada East", "Ahoada West",
        "Akuku-Toru", "Andoni", "Asari-Toru", "Eleme",
        "Emohua", "Etche", "Gokana", "Ikwerre", "Khana",
        "Obio-Akpor", "Ogba-Egbema-Ndoni", "Ogu-Bolo",
        "Okrika", "Omuma", "Opobo-Nkoro", "Oyigbo", "Tai"
    ],
    "Sokoto": [
        "Sokoto", "Binji", "Bodinga", "Dange Shuni", "Gada",
        "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa",
        "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari",
        "Silame", "Sokoto North", "Sokoto South", "Tambuwal",
        "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"
    ],
    "Taraba": [
        "Jalingo", "Wukari", "Bali", "Donga", "Gashaka",
        "Gassol", "Ibi", "Karim Lamido", "Kumi", "Lau",
        "Sardauna", "Takum", "Ussa", "Zing"
    ],
    "Yobe": [
        "Damaturu", "Potiskum", "Gashua", "Bade", "Bursari",
        "Fika", "Fune", "Geidam", "Gujba", "Gulani",
        "Jakusko", "Karasuwa", "Machina", "Nangere",
        "Nguru", "Tarmuwa", "Yunusari", "Yusufari"
    ],
    "Zamfara": [
        "Gusau", "Kaura Namoda", "Talata Mafara", "Anka",
        "Bakura", "Birnin Magaji", "Bukkuyum", "Bungudu",
        "Gummi", "Isa", "Maradun", "Maru",
        "Shinkafi", "Tsafe", "Zurmi"
    ]
}

export const STATES = Object.keys(NIGERIA_LOCATIONS).sort()
export const getCities = (state) => NIGERIA_LOCATIONS[state] || []
export default NIGERIA_LOCATIONS