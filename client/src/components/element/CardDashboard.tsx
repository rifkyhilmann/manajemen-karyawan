

interface Props {
    color: string;
    title : string;
    count: any;
    images : string;
}

export const CardDashboard: React.FC<Props> = ({ color, count, title, images }) => {
    return (
        <div className={`h-36 rounded ${color} relative overflow-hidden flex p-5`}>
            <div className="flex gap-5">
                <div className="h-10 w-10 transparent  rounded  flex items-center justify-center ">
                    <img src={images} className="h-5 w- " alt="" />
                </div>
                <div className="flex flex-col text-white">
                    <p className="font-semibold text-lg">{count}</p>
                    <p className="font-semibold text-sm ">{title}</p>
                </div>
            </div>
            <div className="h-32 w-32 rounded-full opacity-30 bg-white absolute -bottom-10 -right-5"></div>
        </div>
    );
};
