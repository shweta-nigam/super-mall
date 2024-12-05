"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const { pageLevelLoader, setPageLevelLoader, isAuthUser } = useContext(GlobalContext);

  const router = useRouter();

  function isFormValid() {
    return (
      formData &&
      formData.name &&
      formData.name.trim() !== "" &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
    );
  }

  async function handleRegisterOnSubmit() {
    setPageLevelLoader(true);
    const data = await registerNewUser(formData);

    if (data.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsRegistered(true);
      setPageLevelLoader(false);
      setFormData(initialFormData);
    } else {
      toast.error(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#662D8C] to-[#ED1E79] p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#662D8C]">
          {isRegistered ? "Registration Successful!" : "Create an Account"}
        </h2>

        {isRegistered ? (
          <button
            className="w-full bg-gradient-to-r from-[#662D8C] to-[#ED1E79] text-white py-3 rounded-lg font-semibold 
            transition duration-200 "
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        ) : (
          <div className="space-y-6">
            {registrationFormControls.map((controlItem) =>
              controlItem.componentType === "input" ? (
                <InputComponent
                  key={controlItem.id}
                  type={controlItem.type}
                  placeholder={controlItem.placeholder}
                  label={controlItem.label}
                  value={formData[controlItem.id]}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: event.target.value,
                    });
                  }}
                  className="w-full text-black"
                />
              ) : controlItem.componentType === "select" ? (
                <SelectComponent
                  key={controlItem.id}
                  options={controlItem.options}
                  label={controlItem.label}
                  value={formData[controlItem.id]}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: event.target.value,
                    });
                  }}
                  className="w-full text-black"
                />
              ) : null
            )}

            <button
              className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 
                ${isFormValid()
                  ? "bg-gradient-to-r from-[#662D8C] to-[#ED1E79] hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
              disabled={!isFormValid()}
              onClick={handleRegisterOnSubmit}
            >
              {pageLevelLoader ? (
                <ComponentLevelLoader
                  text={"Registering"}
                  color={"#ffffff"}
                  loading={pageLevelLoader}
                />
              ) : (
                "Register"
              )}
            </button>
          </div>
        )}
      </div>
      <Notification />
    </div>
  );
}

