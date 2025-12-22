"use client"
import { useModal } from "../../hooks/useModal";
import { Modal } from "./ui/modal";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { isPhoneNumber } from "./utils";
import { BaseAccountInfo } from "./types"
import { Loader2 } from "lucide-react";
import Button from "./ui/button/Button";
import Input from "./form/input/InputField";
import Select from "./form/Select";
import Label from "./form/Label";
import { UpdateBaseAccountInfo } from "./actions";


export default function UserInfoCard({ data }: { data: BaseAccountInfo }) {

  const { isOpen, openModal, closeModal } = useModal();
  const [accountInfo, setAccountInfo] = useState<BaseAccountInfo>(data)
  const [errorModal, setErrorModal] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<BaseAccountInfo>({
    defaultValues: {
      ...data
    }
  })

  const onSubmit = async (data: BaseAccountInfo) => {
    setAccountInfo(data)
    const { error } = await UpdateBaseAccountInfo(data)
    if (error) {
      setErrorModal(true)
    } else {
      closeModal();
    }

  }

  const standardOptions = [
    { label: "1 gwiazdka", value: 4 },
    { label: "2 gwiazdki", value: 5 },
    { label: "3 gwiazdki", value: 6 },
    { label: "4 gwiazdki", value: 7 },
    { label: "5 gwiazdek", value: 8 },
  ]

  const hotelTypesOptions = [
    { label: "hotel", value: 1 },
    { label: "spa", value: 2 },
    { label: "apartamenty", value: 3 },
    { label: "inne", value: 4 },
  ]

  const hotelStandard = standardOptions.find(o => (o.value == accountInfo.standard))?.label ?? "-"

  const ObjectType = hotelTypesOptions.find(o => (o.value == accountInfo.object_type.value))?.label ?? "-"


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informacje o obiekcie
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nazwa Hotelu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {accountInfo.hotel_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Strona hotelu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.webiste_url ?? "-"}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.email ?? "-"}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Telefon
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.phone?.length ? accountInfo.phone : "-"}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Standard obiektu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {hotelStandard}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Typ obiektu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {ObjectType}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edytuj informacje:
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Zaktualizuj dane, jeśli się zmieniły
            </p>
          </div>
          {errorModal && <div className="border border-t-0 border-red-400 rounded-b bg-red-100 mr-10 mb-4 px-4 py-1 text-red-700">
            <p>Bład w przetwarzaniu formularz</p>
          </div>}
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informacje o obiekcie
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nazwa hotelu</Label>
                    <Input rules={{ required: "Podaj nazwe hotelu/obiektu" }} type="text" value={accountInfo.hotel_name} register={register} name="hotel_name" hint={errors.hotel_name} error={!!errors.hotel_name} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Strona hotelu</Label>
                    <Input rules={{ required: "Podaj strone hotelu/obiektu" }} type="text" value={accountInfo.webiste_url} register={register} name="webiste_url" hint={errors.webiste_url} error={!!errors.webiste_url} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Adres email</Label>
                    <Input rules={{ required: "Email jest wymagany" }} type="email" value={accountInfo.email} register={register} name="email" hint={errors.email} error={!!errors.email} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Telefon</Label>
                    <Input type="tel" value={accountInfo.phone} register={register} name="phone" hint={errors.phone} error={!!errors.phone} rules={{
                      validate: (val) => (isPhoneNumber(val as string) || !val ) || "Nieprawidłowy numer telefonu"
                    }} />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Standard obiektu (gwiazdki)</Label>
                    <Select options={standardOptions} onChange={(val) => setValue("standard", Number(val))} />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Typ obiektu</Label>
                    <Select options={hotelTypesOptions} onChange={(val) => setValue('object_type.value', Number(val))} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">
                Save Changes
                {isSubmitting && <Loader2 className="ml-2 h-5 w-5 animate-spin inline-block" />}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
