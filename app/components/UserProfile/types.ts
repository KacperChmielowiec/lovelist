import { EventItem, SeasonType, StayTimeType } from "@/app/register/types"
import { ClientType } from "@/app/register/types"


type ObjectType = {
    label: string,
    value: number
}

export type BaseAccountInfo = {
    email: string,
    hotel_name: string,
    phone?: string,
    webiste_url?: string,
    standard: number,
    object_type: ObjectType
}

export type DetailsAccountInfo = {
    room_amount: number,
    bed_amount: number,
    annoual_occupancy: number,
    clients_type?: ClientType[],
    season?: SeasonType,
    avarage_time?: StayTimeType
}

export type AddressAccountInfo = {
    city: string,
    country: string,
}

export type SocialAccountInfo = {
    googleCard: string,
    bookingSystem: string,
    facebook: string,
    linkedin: string,
    instagram: string
}

export type EventsAccountInfo = {
    events: EventItem[]
}