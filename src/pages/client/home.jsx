import CardItem from "../../components/client/cardItem"
import banner from "../../assets/img/png/banner.png"
import banner2 from "../../assets/img/png/banner2.png"
import banner3 from "../../assets/img/png/banner3.png"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
};
const banners = [
    banner,
    banner2,
    banner3
];
const HomePage = () => {

    return (
        <div className="p-5 pt-20">
            <div className="flex justify-center">
                <div className="w-[800px] max-md:w-[350px] max-lg:w-[500px]">
                    <Slider {...sliderSettings}>
                        {banners.map((img, index) => (
                            <img key={index} src={img} alt={`banner-${index}`} className="w-full max-sm:w-auto h-auto" />
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="p-10">
                <hr />
            </div>
            <section>
                <div className="flex items-center gap-3 justify-center">
                    <h2 className="font-bold text-3xl">New Arrival</h2>
                </div>
                <CardItem type="ALL" />
            </section>
        </div >
    )
}
export default HomePage