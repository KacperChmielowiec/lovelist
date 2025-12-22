
export type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  hotelName: string;
};

export enum TowelColors {
    "Biały" = 1,
    "Czarny" = 2
}

export type FormData5 = {
  towel_color: TowelColors
  bathroom_amount: number
  logo: boolean,
  towel_amount_xl: number,
  towel_amount_md: number,
  towel_amount_sm: number,
  bathrobes: boolean,
  slippers: boolean,
  cosmetics: boolean,
  bag: boolean

}

export type FormData2 = {
  objectType: string;             // Hotel, Aparthotel itd.
  category: string;               // Gwiazdki lub poziom standardu
  website?: string;               // URL
  googleCard?: string;            // Google Business link
  bookingSystems?: string;        // wpis tekstowy
  facebook: string;
  linkedin: string;
  instagram: string;
  logo?: FileList;                // upload pliku
};

export type location = {
  name: string,
  address: string,
  lat: number
  lng: number,
}


export enum EventCategory {
  "Culture" = 3,
  "Food" = 1,
  "Nature" = 2,
}

export enum locationType {
   "attraction" = 1,
   "event" = 2,
   "other" = 3
}

export interface EventItem {
  id_event?: number
  name: string;
  url: string;
  description: string;
  category?: EventCategory;
  date: string;     // ISO string or Date (zależy od formularza)
  hour: string;     // "12:30" lub Time
  price?: number;
  bestTime: BestTime;
  type: locationType
  location?: location
}

export type FormData3 = {
  room_number: number;
  bed_number: number;
  annual_occupancy: number;
  average_stay_length: string;
  clients_type: string[];
  peak_season: string;
}

export enum BestTime {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening",
  Night = "night"
}

export interface FormData4 {
  events: EventItem[];
  attractions: EventItem[]
}

export type ClientType = {
   key: number,
   label: string
}

export type SeasonType = {
   key: number,
   label: string
}

export type StayTimeType = {
   key: number,
   label: string
}

