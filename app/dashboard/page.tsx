import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import UserDetailsInfo from "../components/UserProfile/UserDetailsInfo";
import { getHotelEvents, getHotelIDetails, getHotelInformation, getHotelLocation, getHotelSocialMedia } from "../components/UserProfile/actions"
import { userIsActive } from "../auth/actions";
import UserSocialCard from "../components/UserProfile/UserSocialCard";
import UserEventsCard from "../components/UserProfile/UserEventsCard";

export default async function UserProfiles() {

   const [
    userInfo,
    locationrInfo,
    socialInfo,
    eventsInfo,
    detailsInfo,
    isActive
  ] = await Promise.all([
    getHotelInformation(),
    getHotelLocation(),
    getHotelSocialMedia(),
    getHotelEvents(),
    getHotelIDetails(),
    userIsActive(),
  ])

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        {!isActive && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
          <strong className="font-bold">Informacja! </strong>
          <span className="block sm:inline">Twój email wymaga weryfikacji.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>}
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard data={userInfo} />
          <UserDetailsInfo data={detailsInfo} />
          <UserAddressCard data={locationrInfo} />
          <UserSocialCard data={socialInfo} />
          <UserEventsCard data={eventsInfo} />
        </div>
      </div>
    </>
  );
}
