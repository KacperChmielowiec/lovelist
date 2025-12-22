"use client"
import { useModal } from "../../hooks/useModal";
import { Modal } from "./ui/modal";
import { useForm, Controller } from "react-hook-form";
import Button from "./ui/button/Button";
import Input from "./form/input/InputField";
import Select from "./form/Select";
import MultiSelect from "./form/MultiSelect";
import Label from "./form/Label";
import { DetailsAccountInfo } from "./types"
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UpdateDetailsAccount } from "./actions";




export default function UserDetailsInfo({ data }: { data: DetailsAccountInfo }) {

  const seasonOptions = [
    { label: "Wiosna", value: '1' },
    { label: "Lato", value: '2' },
    { label: "Jesień", value: '3' },
    { label: "Zima", value: '4' },
  ]

  const clientsOptions = [
    { text: "Rodziny", value: '1' },
    { text: "Pary", value: '2' },
    { text: "Turyści", value: '3' },
    { text: "Wellness/Spa", value: '4' },
  ]

  const { isOpen, openModal, closeModal } = useModal();
  const [accountInfo, setAccountInfo] = useState<DetailsAccountInfo>(data)
  const [errorModal, setErrorModal] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, control } = useForm<DetailsAccountInfo>({
    defaultValues: {
      ...data
    }
  })

  const onSubmit = async (data: DetailsAccountInfo) => {
    setAccountInfo(data)
    const { error } = await UpdateDetailsAccount(data)
    if (error) {
        setErrorModal(true)
    }
    else{
        closeModal();
    }
  }

    useEffect(() => {
      if(!isOpen)
        setErrorModal(false)
    },[isOpen])

  const setClientType = (value: string[]) => {
    const result = value.map((el) => ({ label: clientsOptions.find(o => o.value === el)?.text ?? "", key: Number(el) }))
    setValue('clients_type', result)
  }

  const setSeason = (value: string) => {
    return { label: seasonOptions.find(s => s.value === value)?.label ?? "", key: Number(value) }
  }


  const getSelectedClientTypes = () => accountInfo.clients_type?.map((el) => el.key.toString())

  const getClientsType = () => {
    if (!accountInfo.clients_type) return "brak danych"
    return accountInfo.clients_type.map(el => (el.label)).join("/")
  }




  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Dodatkowe informacje o obiekcie / hotelu
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ilość pomieszczeń
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.room_amount ?? "-"}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ilośc lóżek
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.bed_amount ?? "-"}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Roczne obłożenie (%)
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo.annoual_occupancy ?? '-'}`}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Typ klientów
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getClientsType()}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Sczytowy sezon
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo?.season?.label ?? "-"}`}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Średnia długość pobytu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {`${accountInfo?.avarage_time?.label ?? "-"}`}
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
              Szczegółowe informacje
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Zaktualizuj Szczegółowe dane, jeśli się zmieniły
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                {errorModal && <div className="border border-t-0 border-red-400 rounded-b bg-red-100 mr-10 mb-4 px-4 py-1 text-red-700">
                  <p>Bład w przetwarzaniu formularz</p>
                </div>}

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Ilość pomieszczeń</Label>
                    <Input type="number" value={accountInfo.room_amount} register={register} name="room_amount" hint={errors.room_amount} error={!!errors.room_amount} rules={{ required: "Podaj ilość pokojów" }} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Ilość łóżek</Label>
                    <Input type="text" value={accountInfo.bed_amount} register={register} name="bed_amount" hint={errors.bed_amount} error={!!errors.bed_amount} rules={{ required: "Podaj ilość łóżek" }} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Roczne obłożenie (%)</Label>
                    <Input type="number"
                      value={accountInfo.annoual_occupancy}
                      register={register} name="annoual_occupancy"
                      hint={errors.annoual_occupancy} error={!!errors.annoual_occupancy}
                      rules={{
                        required: "Podaj obłożenie", min: { value: 0, message: "minimalna warość 0" },
                        max: { value: 100, message: "maksymalna warość 100" }
                      }}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <MultiSelect label="Typy klientów" options={clientsOptions} onChange={(value: string[]) => { setClientType(value) }} defaultSelected={getSelectedClientTypes()} />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Typ obiektu</Label>
                    <Controller
                      name="season"
                      control={control}
                      rules={{ required: 'Wybierz sezon szczytowy' }}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            options={seasonOptions}
                            onChange={(val) => field.onChange(setSeason(val))}
                          />
                          {fieldState.error && <p style={{ color: 'red' }}>{fieldState.error.message}</p>}
                        </>
                      )}
                    />
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
