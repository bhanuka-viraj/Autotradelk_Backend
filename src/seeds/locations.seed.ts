import { AppDataSource } from "../config/database.config";
import { Location, LocationType } from "../entities/Location";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("LocationsSeed");

const sriLankaLocations = [
  // Western Province
  {
    name: "Western Province",
    nameSinhala: "බස්නාහිර පළාත",
    nameTamil: "மேல் மாகாணம்",
    type: LocationType.PROVINCE,
    code: "WP",
    sortOrder: 1,
    children: [
      {
        name: "Colombo",
        nameSinhala: "කොළඹ",
        nameTamil: "கொழும்பு",
        type: LocationType.DISTRICT,
        code: "COL",
        sortOrder: 1,
        children: [
          {
            name: "Colombo City",
            nameSinhala: "කොළඹ නගරය",
            nameTamil: "கொழும்பு நகரம்",
            type: LocationType.CITY,
            code: "COL01",
            sortOrder: 1,
            children: [
              {
                name: "Colombo 1",
                type: LocationType.AREA,
                code: "COL0101",
                sortOrder: 1,
              },
              {
                name: "Colombo 2",
                type: LocationType.AREA,
                code: "COL0102",
                sortOrder: 2,
              },
              {
                name: "Colombo 3",
                type: LocationType.AREA,
                code: "COL0103",
                sortOrder: 3,
              },
              {
                name: "Colombo 4",
                type: LocationType.AREA,
                code: "COL0104",
                sortOrder: 4,
              },
              {
                name: "Colombo 5",
                type: LocationType.AREA,
                code: "COL0105",
                sortOrder: 5,
              },
              {
                name: "Colombo 6",
                type: LocationType.AREA,
                code: "COL0106",
                sortOrder: 6,
              },
              {
                name: "Colombo 7",
                type: LocationType.AREA,
                code: "COL0107",
                sortOrder: 7,
              },
              {
                name: "Colombo 8",
                type: LocationType.AREA,
                code: "COL0108",
                sortOrder: 8,
              },
              {
                name: "Colombo 9",
                type: LocationType.AREA,
                code: "COL0109",
                sortOrder: 9,
              },
              {
                name: "Colombo 10",
                type: LocationType.AREA,
                code: "COL0110",
                sortOrder: 10,
              },
              {
                name: "Colombo 11",
                type: LocationType.AREA,
                code: "COL0111",
                sortOrder: 11,
              },
              {
                name: "Colombo 12",
                type: LocationType.AREA,
                code: "COL0112",
                sortOrder: 12,
              },
              {
                name: "Colombo 13",
                type: LocationType.AREA,
                code: "COL0113",
                sortOrder: 13,
              },
              {
                name: "Colombo 14",
                type: LocationType.AREA,
                code: "COL0114",
                sortOrder: 14,
              },
              {
                name: "Colombo 15",
                type: LocationType.AREA,
                code: "COL0115",
                sortOrder: 15,
              },
            ],
          },
          {
            name: "Dehiwala-Mount Lavinia",
            nameSinhala: "දෙහිවල-ගල්කිස්ස",
            nameTamil: "தெஹிவளை-கல்கிசை",
            type: LocationType.CITY,
            code: "COL02",
            sortOrder: 2,
            children: [
              {
                name: "Dehiwala",
                type: LocationType.AREA,
                code: "COL0201",
                sortOrder: 1,
              },
              {
                name: "Mount Lavinia",
                type: LocationType.AREA,
                code: "COL0202",
                sortOrder: 2,
              },
              {
                name: "Ratmalana",
                type: LocationType.AREA,
                code: "COL0203",
                sortOrder: 3,
              },
              {
                name: "Moratuwa",
                type: LocationType.AREA,
                code: "COL0204",
                sortOrder: 4,
              },
            ],
          },
          {
            name: "Sri Jayawardenepura Kotte",
            nameSinhala: "ශ්‍රී ජයවර්ධනපුර කෝට්ටේ",
            nameTamil: "ஸ்ரீ ஜயவர்த்தனபுர கோட்டை",
            type: LocationType.CITY,
            code: "COL03",
            sortOrder: 3,
            children: [
              {
                name: "Kotte",
                type: LocationType.AREA,
                code: "COL0301",
                sortOrder: 1,
              },
              {
                name: "Nugegoda",
                type: LocationType.AREA,
                code: "COL0302",
                sortOrder: 2,
              },
              {
                name: "Maharagama",
                type: LocationType.AREA,
                code: "COL0303",
                sortOrder: 3,
              },
              {
                name: "Kesbewa",
                type: LocationType.AREA,
                code: "COL0304",
                sortOrder: 4,
              },
            ],
          },
        ],
      },
      {
        name: "Gampaha",
        nameSinhala: "ගම්පහ",
        nameTamil: "கம்பஹா",
        type: LocationType.DISTRICT,
        code: "GAM",
        sortOrder: 2,
        children: [
          {
            name: "Gampaha City",
            nameSinhala: "ගම්පහ නගරය",
            nameTamil: "கம்பஹா நகரம்",
            type: LocationType.CITY,
            code: "GAM01",
            sortOrder: 1,
            children: [
              {
                name: "Gampaha",
                type: LocationType.AREA,
                code: "GAM0101",
                sortOrder: 1,
              },
              {
                name: "Negombo",
                type: LocationType.AREA,
                code: "GAM0102",
                sortOrder: 2,
              },
              {
                name: "Ja-Ela",
                type: LocationType.AREA,
                code: "GAM0103",
                sortOrder: 3,
              },
              {
                name: "Wattala",
                type: LocationType.AREA,
                code: "GAM0104",
                sortOrder: 4,
              },
              {
                name: "Kelaniya",
                type: LocationType.AREA,
                code: "GAM0105",
                sortOrder: 5,
              },
            ],
          },
        ],
      },
      {
        name: "Kalutara",
        nameSinhala: "කළුතර",
        nameTamil: "களுத்துறை",
        type: LocationType.DISTRICT,
        code: "KAL",
        sortOrder: 3,
        children: [
          {
            name: "Kalutara City",
            nameSinhala: "කළුතර නගරය",
            nameTamil: "களுத்துறை நகரம்",
            type: LocationType.CITY,
            code: "KAL01",
            sortOrder: 1,
            children: [
              {
                name: "Kalutara",
                type: LocationType.AREA,
                code: "KAL0101",
                sortOrder: 1,
              },
              {
                name: "Panadura",
                type: LocationType.AREA,
                code: "KAL0102",
                sortOrder: 2,
              },
              {
                name: "Bandaragama",
                type: LocationType.AREA,
                code: "KAL0103",
                sortOrder: 3,
              },
              {
                name: "Horana",
                type: LocationType.AREA,
                code: "KAL0104",
                sortOrder: 4,
              },
            ],
          },
        ],
      },
    ],
  },
  // Central Province
  {
    name: "Central Province",
    nameSinhala: "මධ්‍යම පළාත",
    nameTamil: "மத்திய மாகாணம்",
    type: LocationType.PROVINCE,
    code: "CP",
    sortOrder: 2,
    children: [
      {
        name: "Kandy",
        nameSinhala: "මහනුවර",
        nameTamil: "கண்டி",
        type: LocationType.DISTRICT,
        code: "KAN",
        sortOrder: 1,
        children: [
          {
            name: "Kandy City",
            nameSinhala: "මහනුවර නගරය",
            nameTamil: "கண்டி நகரம்",
            type: LocationType.CITY,
            code: "KAN01",
            sortOrder: 1,
            children: [
              {
                name: "Kandy",
                type: LocationType.AREA,
                code: "KAN0101",
                sortOrder: 1,
              },
              {
                name: "Peradeniya",
                type: LocationType.AREA,
                code: "KAN0102",
                sortOrder: 2,
              },
              {
                name: "Katugastota",
                type: LocationType.AREA,
                code: "KAN0103",
                sortOrder: 3,
              },
              {
                name: "Gampola",
                type: LocationType.AREA,
                code: "KAN0104",
                sortOrder: 4,
              },
            ],
          },
        ],
      },
      {
        name: "Matale",
        nameSinhala: "මාතලේ",
        nameTamil: "மாத்தளை",
        type: LocationType.DISTRICT,
        code: "MAT",
        sortOrder: 2,
        children: [
          {
            name: "Matale City",
            nameSinhala: "මාතලේ නගරය",
            nameTamil: "மாத்தளை நகரம்",
            type: LocationType.CITY,
            code: "MAT01",
            sortOrder: 1,
            children: [
              {
                name: "Matale",
                type: LocationType.AREA,
                code: "MAT0101",
                sortOrder: 1,
              },
              {
                name: "Dambulla",
                type: LocationType.AREA,
                code: "MAT0102",
                sortOrder: 2,
              },
              {
                name: "Galewela",
                type: LocationType.AREA,
                code: "MAT0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Nuwara Eliya",
        nameSinhala: "නුවරඑළිය",
        nameTamil: "நுவரெலியா",
        type: LocationType.DISTRICT,
        code: "NUE",
        sortOrder: 3,
        children: [
          {
            name: "Nuwara Eliya City",
            nameSinhala: "නුවරඑළිය නගරය",
            nameTamil: "நுவரெலியா நகரம்",
            type: LocationType.CITY,
            code: "NUE01",
            sortOrder: 1,
            children: [
              {
                name: "Nuwara Eliya",
                type: LocationType.AREA,
                code: "NUE0101",
                sortOrder: 1,
              },
              {
                name: "Hatton",
                type: LocationType.AREA,
                code: "NUE0102",
                sortOrder: 2,
              },
              {
                name: "Talawakele",
                type: LocationType.AREA,
                code: "NUE0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  // Southern Province
  {
    name: "Southern Province",
    nameSinhala: "දකුණු පළාත",
    nameTamil: "தென் மாகாணம்",
    type: LocationType.PROVINCE,
    code: "SP",
    sortOrder: 3,
    children: [
      {
        name: "Galle",
        nameSinhala: "ගාල්ල",
        nameTamil: "காலி",
        type: LocationType.DISTRICT,
        code: "GAL",
        sortOrder: 1,
        children: [
          {
            name: "Galle City",
            nameSinhala: "ගාල්ල නගරය",
            nameTamil: "காலி நகரம்",
            type: LocationType.CITY,
            code: "GAL01",
            sortOrder: 1,
            children: [
              {
                name: "Galle",
                type: LocationType.AREA,
                code: "GAL0101",
                sortOrder: 1,
              },
              {
                name: "Ambalangoda",
                type: LocationType.AREA,
                code: "GAL0102",
                sortOrder: 2,
              },
              {
                name: "Hikkaduwa",
                type: LocationType.AREA,
                code: "GAL0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Matara",
        nameSinhala: "මාතර",
        nameTamil: "மாத்தறை",
        type: LocationType.DISTRICT,
        code: "MTR",
        sortOrder: 2,
        children: [
          {
            name: "Matara City",
            nameSinhala: "මාතර නගරය",
            nameTamil: "மாத்தறை நகரம்",
            type: LocationType.CITY,
            code: "MTR01",
            sortOrder: 1,
            children: [
              {
                name: "Matara",
                type: LocationType.AREA,
                code: "MTR0101",
                sortOrder: 1,
              },
              {
                name: "Weligama",
                type: LocationType.AREA,
                code: "MTR0102",
                sortOrder: 2,
              },
              {
                name: "Tangalle",
                type: LocationType.AREA,
                code: "MTR0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Hambantota",
        nameSinhala: "හම්බන්තොට",
        nameTamil: "அம்பாந்தோட்டை",
        type: LocationType.DISTRICT,
        code: "HAM",
        sortOrder: 3,
        children: [
          {
            name: "Hambantota City",
            nameSinhala: "හම්බන්තොට නගරය",
            nameTamil: "அம்பாந்தோட்டை நகரம்",
            type: LocationType.CITY,
            code: "HAM01",
            sortOrder: 1,
            children: [
              {
                name: "Hambantota",
                type: LocationType.AREA,
                code: "HAM0101",
                sortOrder: 1,
              },
              {
                name: "Tissamaharama",
                type: LocationType.AREA,
                code: "HAM0102",
                sortOrder: 2,
              },
              {
                name: "Beliatta",
                type: LocationType.AREA,
                code: "HAM0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  // Northern Province
  {
    name: "Northern Province",
    nameSinhala: "උතුරු පළාත",
    nameTamil: "வட மாகாணம்",
    type: LocationType.PROVINCE,
    code: "NP",
    sortOrder: 4,
    children: [
      {
        name: "Jaffna",
        nameSinhala: "යාපනය",
        nameTamil: "யாழ்ப்பாணம்",
        type: LocationType.DISTRICT,
        code: "JAF",
        sortOrder: 1,
        children: [
          {
            name: "Jaffna City",
            nameSinhala: "යාපනය නගරය",
            nameTamil: "யாழ்ப்பாணம் நகரம்",
            type: LocationType.CITY,
            code: "JAF01",
            sortOrder: 1,
            children: [
              {
                name: "Jaffna",
                type: LocationType.AREA,
                code: "JAF0101",
                sortOrder: 1,
              },
              {
                name: "Chavakachcheri",
                type: LocationType.AREA,
                code: "JAF0102",
                sortOrder: 2,
              },
              {
                name: "Point Pedro",
                type: LocationType.AREA,
                code: "JAF0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Kilinochchi",
        nameSinhala: "කිලිනොච්චි",
        nameTamil: "கிளிநொச்சி",
        type: LocationType.DISTRICT,
        code: "KIL",
        sortOrder: 2,
        children: [
          {
            name: "Kilinochchi City",
            nameSinhala: "කිලිනොච්චි නගරය",
            nameTamil: "கிளிநொச்சி நகரம்",
            type: LocationType.CITY,
            code: "KIL01",
            sortOrder: 1,
            children: [
              {
                name: "Kilinochchi",
                type: LocationType.AREA,
                code: "KIL0101",
                sortOrder: 1,
              },
            ],
          },
        ],
      },
      {
        name: "Mullaitivu",
        nameSinhala: "මුල්ලයිතිව්",
        nameTamil: "முல்லைத்தீவு",
        type: LocationType.DISTRICT,
        code: "MUL",
        sortOrder: 3,
        children: [
          {
            name: "Mullaitivu City",
            nameSinhala: "මුල්ලයිතිව් නගරය",
            nameTamil: "முல்லைத்தீவு நகரம்",
            type: LocationType.CITY,
            code: "MUL01",
            sortOrder: 1,
            children: [
              {
                name: "Mullaitivu",
                type: LocationType.AREA,
                code: "MUL0101",
                sortOrder: 1,
              },
            ],
          },
        ],
      },
      {
        name: "Vavuniya",
        nameSinhala: "වවුනියාව",
        nameTamil: "வவுனியா",
        type: LocationType.DISTRICT,
        code: "VAV",
        sortOrder: 4,
        children: [
          {
            name: "Vavuniya City",
            nameSinhala: "වවුනියාව නගරය",
            nameTamil: "வவுனியா நகரம்",
            type: LocationType.CITY,
            code: "VAV01",
            sortOrder: 1,
            children: [
              {
                name: "Vavuniya",
                type: LocationType.AREA,
                code: "VAV0101",
                sortOrder: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  // Eastern Province
  {
    name: "Eastern Province",
    nameSinhala: "නැගෙනහිර පළාත",
    nameTamil: "கிழக்கு மாகாணம்",
    type: LocationType.PROVINCE,
    code: "EP",
    sortOrder: 5,
    children: [
      {
        name: "Batticaloa",
        nameSinhala: "මඩකලපුව",
        nameTamil: "மட்டக்களப்பு",
        type: LocationType.DISTRICT,
        code: "BAT",
        sortOrder: 1,
        children: [
          {
            name: "Batticaloa City",
            nameSinhala: "මඩකලපුව නගරය",
            nameTamil: "மட்டக்களப்பு நகரம்",
            type: LocationType.CITY,
            code: "BAT01",
            sortOrder: 1,
            children: [
              {
                name: "Batticaloa",
                type: LocationType.AREA,
                code: "BAT0101",
                sortOrder: 1,
              },
              {
                name: "Kattankudy",
                type: LocationType.AREA,
                code: "BAT0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        name: "Ampara",
        nameSinhala: "අම්පාර",
        nameTamil: "அம்பாறை",
        type: LocationType.DISTRICT,
        code: "AMP",
        sortOrder: 2,
        children: [
          {
            name: "Ampara City",
            nameSinhala: "අම්පාර නගරය",
            nameTamil: "அம்பாறை நகரம்",
            type: LocationType.CITY,
            code: "AMP01",
            sortOrder: 1,
            children: [
              {
                name: "Ampara",
                type: LocationType.AREA,
                code: "AMP0101",
                sortOrder: 1,
              },
              {
                name: "Kalmunai",
                type: LocationType.AREA,
                code: "AMP0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        name: "Trincomalee",
        nameSinhala: "ත්‍රිකුණාමලය",
        nameTamil: "திருகோணமலை",
        type: LocationType.DISTRICT,
        code: "TRI",
        sortOrder: 3,
        children: [
          {
            name: "Trincomalee City",
            nameSinhala: "ත්‍රිකුණාමලය නගරය",
            nameTamil: "திருகோணமலை நகரம்",
            type: LocationType.CITY,
            code: "TRI01",
            sortOrder: 1,
            children: [
              {
                name: "Trincomalee",
                type: LocationType.AREA,
                code: "TRI0101",
                sortOrder: 1,
              },
              {
                name: "Kantale",
                type: LocationType.AREA,
                code: "TRI0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  // North Western Province
  {
    name: "North Western Province",
    nameSinhala: "වයඹ පළාත",
    nameTamil: "வடமேற்கு மாகாணம்",
    type: LocationType.PROVINCE,
    code: "NWP",
    sortOrder: 6,
    children: [
      {
        name: "Kurunegala",
        nameSinhala: "කුරුණෑගල",
        nameTamil: "குருநாகல்",
        type: LocationType.DISTRICT,
        code: "KUR",
        sortOrder: 1,
        children: [
          {
            name: "Kurunegala City",
            nameSinhala: "කුරුණෑගල නගරය",
            nameTamil: "குருநாகல் நகரம்",
            type: LocationType.CITY,
            code: "KUR01",
            sortOrder: 1,
            children: [
              {
                name: "Kurunegala",
                type: LocationType.AREA,
                code: "KUR0101",
                sortOrder: 1,
              },
              {
                name: "Kuliyapitiya",
                type: LocationType.AREA,
                code: "KUR0102",
                sortOrder: 2,
              },
              {
                name: "Polgahawela",
                type: LocationType.AREA,
                code: "KUR0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Puttalam",
        nameSinhala: "පුත්තලම",
        nameTamil: "புத்தளம்",
        type: LocationType.DISTRICT,
        code: "PUT",
        sortOrder: 2,
        children: [
          {
            name: "Puttalam City",
            nameSinhala: "පුත්තලම නගරය",
            nameTamil: "புத்தளம் நகரம்",
            type: LocationType.CITY,
            code: "PUT01",
            sortOrder: 1,
            children: [
              {
                name: "Puttalam",
                type: LocationType.AREA,
                code: "PUT0101",
                sortOrder: 1,
              },
              {
                name: "Chilaw",
                type: LocationType.AREA,
                code: "PUT0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  // North Central Province
  {
    name: "North Central Province",
    nameSinhala: "උතුරු මධ්‍යම පළාත",
    nameTamil: "வடமத்திய மாகாணம்",
    type: LocationType.PROVINCE,
    code: "NCP",
    sortOrder: 7,
    children: [
      {
        name: "Anuradhapura",
        nameSinhala: "අනුරාධපුරය",
        nameTamil: "அனுராதபுரம்",
        type: LocationType.DISTRICT,
        code: "ANU",
        sortOrder: 1,
        children: [
          {
            name: "Anuradhapura City",
            nameSinhala: "අනුරාධපුරය නගරය",
            nameTamil: "அனுராதபுரம் நகரம்",
            type: LocationType.CITY,
            code: "ANU01",
            sortOrder: 1,
            children: [
              {
                name: "Anuradhapura",
                type: LocationType.AREA,
                code: "ANU0101",
                sortOrder: 1,
              },
              {
                name: "Medawachchiya",
                type: LocationType.AREA,
                code: "ANU0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        name: "Polonnaruwa",
        nameSinhala: "පොළොන්නරුව",
        nameTamil: "பொலன்னறுவை",
        type: LocationType.DISTRICT,
        code: "POL",
        sortOrder: 2,
        children: [
          {
            name: "Polonnaruwa City",
            nameSinhala: "පොළොන්නරුව නගරය",
            nameTamil: "பொலன்னறுவை நகரம்",
            type: LocationType.CITY,
            code: "POL01",
            sortOrder: 1,
            children: [
              {
                name: "Polonnaruwa",
                type: LocationType.AREA,
                code: "POL0101",
                sortOrder: 1,
              },
              {
                name: "Kaduruwela",
                type: LocationType.AREA,
                code: "POL0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  // Uva Province
  {
    name: "Uva Province",
    nameSinhala: "ඌව පළාත",
    nameTamil: "ஊவா மாகாணம்",
    type: LocationType.PROVINCE,
    code: "UVA",
    sortOrder: 8,
    children: [
      {
        name: "Badulla",
        nameSinhala: "බදුල්ල",
        nameTamil: "பதுளை",
        type: LocationType.DISTRICT,
        code: "BAD",
        sortOrder: 1,
        children: [
          {
            name: "Badulla City",
            nameSinhala: "බදුල්ල නගරය",
            nameTamil: "பதுளை நகரம்",
            type: LocationType.CITY,
            code: "BAD01",
            sortOrder: 1,
            children: [
              {
                name: "Badulla",
                type: LocationType.AREA,
                code: "BAD0101",
                sortOrder: 1,
              },
              {
                name: "Bandarawela",
                type: LocationType.AREA,
                code: "BAD0102",
                sortOrder: 2,
              },
              {
                name: "Haputale",
                type: LocationType.AREA,
                code: "BAD0103",
                sortOrder: 3,
              },
            ],
          },
        ],
      },
      {
        name: "Monaragala",
        nameSinhala: "මොනරාගල",
        nameTamil: "மொணராகலை",
        type: LocationType.DISTRICT,
        code: "MON",
        sortOrder: 2,
        children: [
          {
            name: "Monaragala City",
            nameSinhala: "මොනරාගල නගරය",
            nameTamil: "மொணராகலை நகரம்",
            type: LocationType.CITY,
            code: "MON01",
            sortOrder: 1,
            children: [
              {
                name: "Monaragala",
                type: LocationType.AREA,
                code: "MON0101",
                sortOrder: 1,
              },
              {
                name: "Wellawaya",
                type: LocationType.AREA,
                code: "MON0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  // Sabaragamuwa Province
  {
    name: "Sabaragamuwa Province",
    nameSinhala: "සබරගමුව පළාත",
    nameTamil: "சபரகமுவ மாகாணம்",
    type: LocationType.PROVINCE,
    code: "SAB",
    sortOrder: 9,
    children: [
      {
        name: "Ratnapura",
        nameSinhala: "රත්නපුර",
        nameTamil: "இரத்தினபுரி",
        type: LocationType.DISTRICT,
        code: "RAT",
        sortOrder: 1,
        children: [
          {
            name: "Ratnapura City",
            nameSinhala: "රත්නපුර නගරය",
            nameTamil: "இரத்தினபுரி நகரம்",
            type: LocationType.CITY,
            code: "RAT01",
            sortOrder: 1,
            children: [
              {
                name: "Ratnapura",
                type: LocationType.AREA,
                code: "RAT0101",
                sortOrder: 1,
              },
              {
                name: "Embilipitiya",
                type: LocationType.AREA,
                code: "RAT0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        name: "Kegalle",
        nameSinhala: "කෑගල්ල",
        nameTamil: "கேகாலை",
        type: LocationType.DISTRICT,
        code: "KEG",
        sortOrder: 2,
        children: [
          {
            name: "Kegalle City",
            nameSinhala: "කෑගල්ල නගරය",
            nameTamil: "கேகாலை நகரம்",
            type: LocationType.CITY,
            code: "KEG01",
            sortOrder: 1,
            children: [
              {
                name: "Kegalle",
                type: LocationType.AREA,
                code: "KEG0101",
                sortOrder: 1,
              },
              {
                name: "Mawanella",
                type: LocationType.AREA,
                code: "KEG0102",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
];

async function createLocation(
  locationData: any,
  parentId?: number
): Promise<Location> {
  const locationRepository = AppDataSource.getRepository(Location);

  const location = locationRepository.create({
    name: locationData.name,
    nameSinhala: locationData.nameSinhala,
    nameTamil: locationData.nameTamil,
    type: locationData.type,
    code: locationData.code,
    sortOrder: locationData.sortOrder,
    parentId: parentId,
  });

  const savedLocation = await locationRepository.save(location);

  // Create children recursively
  if (locationData.children) {
    for (const childData of locationData.children) {
      await createLocation(childData, savedLocation.id);
    }
  }

  return savedLocation;
}

export async function seedLocations(): Promise<Location[]> {
  try {
    logger.info("Starting location seeding...");

    const locationRepository = AppDataSource.getRepository(Location);

    // Check if locations already exist
    const existingCount = await locationRepository.count();
    if (existingCount > 0) {
      logger.info(
        `Locations already exist (${existingCount} locations), skipping seeding`
      );
      return await locationRepository.find();
    }

    // Create locations recursively and collect all created locations
    const createdLocations: Location[] = [];

    async function createLocationAndCollect(
      locationData: any,
      parentId?: number
    ) {
      const location = await createLocation(locationData, parentId);
      createdLocations.push(location);

      // Recursively create and collect children
      if (locationData.children) {
        for (const childData of locationData.children) {
          await createLocationAndCollect(childData, location.id);
        }
      }
    }

    // Create all locations and collect them
    for (const locationData of sriLankaLocations) {
      await createLocationAndCollect(locationData);
    }

    logger.info("Location seeding completed successfully", {
      locationCount: createdLocations.length,
    });

    return createdLocations;
  } catch (error) {
    logger.error("Error seeding locations", { error });
    throw error;
  }
}
