import React from "react";
import CardItem from "../../components/client/cardItem";
import banner from "../../assets/img/png/banner.png";
import banner2 from "../../assets/img/png/banner2.png";
import banner3 from "../../assets/img/png/banner3.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  Heart,
  Users,
  Award,
  Zap,
  Gift,
  TrendingUp,
  Clock,
} from "lucide-react";

const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 animate-pulse-slow"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 animate-pulse-slow"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
);

const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  dots: true,
  dotsClass: "slick-dots !bottom-6",
  fade: true,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
};

const banners = [banner, banner2, banner3];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $50",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment guaranteed",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "High-quality products certified",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Heart,
    title: "24/7 Support",
    description: "Dedicated customer support",
    color: "from-pink-500 to-rose-500",
  },
];

const stats = [
  { number: "50K+", label: "Happy Customers", icon: Users },
  { number: "1000+", label: "Products", icon: ShoppingBag },
  { number: "99%", label: "Satisfaction", icon: Star },
  { number: "24/7", label: "Support", icon: Clock },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing quality and fast delivery! Highly recommended.",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Great customer service and beautiful products.",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Emma Davis",
    rating: 5,
    comment: "Love shopping here! Always find what I need.",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-bounce-slow" />
      </div>

      {/* Hero Slider Section */}
      <section className="pt-16 pb-8 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-6xl">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white animate-fade-in">
                <Slider {...sliderSettings}>
                  {banners.map((img, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-[16/6] lg:aspect-[16/7] overflow-hidden">
                        <img
                          src={img}
                          alt={`banner-${index}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* Banner Overlay Content */}
                        <div className="absolute bottom-8 left-8 text-white animate-slide-up">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-sm font-medium tracking-wider uppercase">
                              New Collection
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            Discover Amazing Products
                          </h3>
                          <p className="text-white/90 mb-4">
                            Premium quality at unbeatable prices
                          </p>
                          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 animate-pulse-slow">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse-delayed" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-bounce-gentle`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Trusted by Thousands
            </h2>
            <p className="text-white/90 text-lg animate-fade-in-delayed">
              Join our growing community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-counter">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed" />
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100/50 mb-6 animate-bounce-gentle">
              <Sparkles className="w-5 h-5 text-blue-600 animate-spin-slow" />
              <span className="text-sm font-medium text-blue-700 tracking-wider uppercase">
                Featured Collection
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 animate-slide-up">
              New
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-3 animate-gradient">
                Arrival
              </span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
              Discover our latest collection of premium products, carefully
              curated to bring you the finest quality and latest trends.
            </p>

            {/* Decorative line */}
            <div className="flex justify-center mt-8 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 animate-expand" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-8 h-0.5 bg-blue-400 animate-expand-delayed" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-delayed" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400 animate-expand" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="relative animate-fade-in-up">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 rounded-3xl -m-8 animate-pulse-slow" />

            <div className="relative">
              <CardItem type="ALL" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse-delayed" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 animate-bounce-gentle">
              <Gift className="w-8 h-8 animate-spin-slow" />
              <span className="text-lg font-medium tracking-wider uppercase">
                Special Offer
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Get 20% Off Your First Order!
            </h2>

            <p className="text-xl text-white/90 mb-8 animate-fade-in-delayed">
              Subscribe to our newsletter and get exclusive deals, early access
              to new products, and special discounts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto animate-fade-in-up">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
              />
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 animate-pulse-slow">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float blur-xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce-slow blur-lg" />
      </section>

      {/* Bottom decorative section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center animate-fade-in">
            <div className="grid grid-cols-3 gap-8 max-w-md">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300 animate-bounce-gentle">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300 animate-bounce-gentle"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg animate-pulse-delayed" />
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300 animate-bounce-gentle"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
