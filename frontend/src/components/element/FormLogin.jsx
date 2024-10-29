import bg from '../../assets/bg.jpg'

const FormLogin = ({children}) => {
    return (
        <div 
            className='form-login  w-full h-screen flex items-center justify-center'>
            <div className='w-[90%] max-w-[350px] h-max bg-white rounded-xl z-20'>
                {children}
            </div>
        </div>
    )
}

export default FormLogin
