import { useState } from "react"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import InputField from "../../../components/element/InputField"
import { Link, useNavigate } from "react-router-dom"
import { FetchSign, GetData } from "../../../utils/apiUtils"
import ButtonSubmit from "../../../components/element/ButtonSubmit"
import { showDialog, showToast } from "../../../utils/alertUtils"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../../../redux/reducers/authReducers"


const LoginAdmin = () => {
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [spinIsActive, setSpinIsActive] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const fetchSign = async () => {
      try {
        const data = { email : emailValue, password : passwordValue}
        const response = await FetchSign('admin/login', data)

        if (response && response.status === 200) { 
            showToast('success', "Sign In Successfully");

            const data = await GetData(`admin/${emailValue}`)

            dispatch(loginSuccess({
                token: response.data.token,
                email: emailValue,
                role: "admin",
                admin : data?.data
            }));       

            navigate('/admin')     
        } else {
            console.error('Unexpected response:', response); 
        }

      } catch (error) {
        showDialog('error', 'Error');
      }
    }

    const handleSign = () => {
        if(!emailValue || !passwordValue) {
            showDialog('error', 'Opps..', 'email and password required')
        } else {
            setSpinIsActive(true);
            setTimeout(() => {
                setSpinIsActive(false);
                fetchSign();
                setEmailValue('');
                setPasswordValue('');
            }, 2000)
        }
    }

    return (
      <div className="bg-primary w-full h-screen flex flex-col gap-7 items-center justify-center font-poppins">
        <div className="w-[90%] max-w-[390px] h-max bg-white shadow-lg rounded-lg py-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-1">
            <p className="font-bold text-slate-800 text-xl">Welcome Back</p>
            <p className="text-xs font-normal text-gray-600 text-center">Enter your credentials to access your account.</p>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8 w-[80%]">
            <InputField 
              title="Enter your email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              icon={faEnvelope}
            />
            <InputField 
              title="Enter your password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              icon={faLock}
            />
            <div className="w-full h-max mt-5">
                <ButtonSubmit 
                    title="Sign In"
                    onClick={handleSign}
                    isLoading={spinIsActive}
                />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <p className="text-slate-500">Forgot your password?</p>
          <Link to="/reset-password">
            <p className="text-blue-500 hover:text-blue-600 cursor-pointer">Reset Password</p>
          </Link>
        </div>
      </div>
    )
}

export default LoginAdmin
