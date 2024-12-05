"use client";
import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { login } from "@/services/login";
import { loginFormControls } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormdata = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormdata);
  const {
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  function isValidForm() {
    return formData?.email?.trim() !== "" && formData?.password?.trim() !== "";
  }

  async function handleLogin() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res = await login(formData);

    if (res.success) {
      toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
      setIsAuthUser(true);
      setUser(res?.finalData?.user);
      setFormData(initialFormdata);
      Cookies.set("token", res?.finalData?.token);
      localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
    } else {
      toast.error(res.message, { position: toast.POSITION.TOP_RIGHT });
      setIsAuthUser(false);
    }
    setComponentLevelLoader({ loading: false, id: "" });
  }

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#662D8C] to-[#ED1E79]">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <div className="space-y-6">
          {loginFormControls.map((controlItem) =>
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
                className="text-black w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
              />
            ) : null
          )}
          <button
            className={`w-full p-3 text-lg text-white rounded-lg transition-all ${
              isValidForm()
                ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isValidForm()}
            onClick={handleLogin}
          >
            {componentLevelLoader?.loading ? (
              <ComponentLevelLoader
                text={"Logging In"}
                color={"#ffffff"}
                loading={componentLevelLoader?.loading}
              />
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center text-gray-600">
            New to website?{" "}
            <button
              className="text-purple-600 hover:underline"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
