import ReactLoading from 'react-loading';

interface pageProps {
    title : string;
    onClick : () => void;
    isLoading : boolean
}

const ButtonSubmit:React.FC<pageProps> = ({title, onClick, isLoading}) => {
    return (
        <div
            className={`h-10 w-full bg-blue-500 hover:bg-blue-600 hover:opacity-50
                flex items-center justify-center rounded-lg cursor-pointer
                text-white
            `}
            onClick={onClick}
        >
            {isLoading ? (
                <ReactLoading type={'spin'} color={'#ffffff'} height={20} width={20} />
            ) : (
                <p className=' font-bold text-sm'>{title}</p>
            )}
        </div>
    )
}

export default ButtonSubmit
