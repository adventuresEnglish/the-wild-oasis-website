"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateGuestAction } from "../_lib/actions";
import { getCountries } from "../_lib/getCountries";
import { Guest } from "../_lib/types";

function UpdateProfileForm({
  guest,
}: // children,
{
  //  children: React.ReactNode;
  guest: Guest;
}) {
  const { fullName, email, nationality, nationalID, countryFlag } = guest;
  const [inputNationalID, setInputNationalID] = useState(nationalID);
  const [inputNationality, setInputNationality] = useState<string>();

  const countries = getCountries();
  const flag =
    countries.find((country) => country.name === inputNationality)?.flag ?? "";

  return (
    <form
      action={updateGuestAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
      <div className="space-y-2">
        <label>Full name</label>
        <input
          name="fullName"
          disabled
          defaultValue={fullName}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          disabled
          defaultValue={email}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {(flag || countryFlag) && (
            <img
              src={flag || countryFlag}
              alt="Country flag"
              className="h-5 rounded-sm"
            />
          )}
        </div>
        <select
          name="nationality"
          id="nationality"
          // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
          defaultValue={`${nationality}%${flag}`}
          onChange={(e) => setInputNationality(e.target.value.split("%")[0])}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm">
          <option value="">Select country...</option>
          {countries.map((c) => (
            <option
              key={c.name}
              value={`${c.name}%${c.flag}`}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          defaultValue={nationalID}
          name="nationalID"
          onChange={(e) => setInputNationalID(e.target.value)}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <Button
          disabled={
            inputNationality === nationality && inputNationalID === nationalID
          }
        />
      </div>
    </form>
  );
}

//useFormStatus must be used in a component that is rendered within a form
function Button({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={disabled || pending}>
      {pending ? "updating" : "Update profile"}
    </button>
  );
}

export default UpdateProfileForm;
