import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const SlickButtonFix = ({ type, onClick }) => {
    const isNext = type === "next";

    return (
        <div
            className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${isNext ? "right-2" : "left-2"
                } bg-[#a4a3a3] bg-opacity-40 rounded-full p-2 cursor-pointer`}
            onClick={onClick}
        >
            {isNext ? (
                <RightOutlined style={{ textAlign: 'center', fontSize: 24, color: "white" }} />
            ) : (
                <LeftOutlined style={{ fontSize: 24, color: "white" }} />
            )}
        </div>
    );
};

export default SlickButtonFix;