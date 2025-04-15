import loading from "../assets/loading.svg";

const Loading = () => {
    return (
        <div className="flex min-h-screen justify-center items-center">
            <img className="w-32" src={loading} alt="loading" />
        </div>
    );
};

export default Loading;
