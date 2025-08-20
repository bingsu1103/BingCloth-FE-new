import React from "react";
import { Button, Card, Divider, Tag, Avatar, Timeline } from "antd";
import {
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaBullseye,
  FaHandshake,
  FaGlobe,
  FaRocket,
  FaStar,
  FaShippingFast,
  FaExchangeAlt,
  FaLock,
} from "react-icons/fa";

// --- Data declarations (consistent with your style) ---
const STATS = [
  { label: "Happy Customers", value: "50K+", icon: FaUsers },
  { label: "Products", value: "1,000+", icon: FaRocket },
  { label: "Satisfaction", value: "99%", icon: FaStar },
  { label: "Countries Served", value: "12+", icon: FaGlobe },
];

const VALUES = [
  {
    icon: FaShieldAlt,
    title: "Trust & Transparency",
    desc: "We put customer benefits first and stay transparent about quality and pricing.",
  },
  {
    icon: FaHandshake,
    title: "Commitment",
    desc: "24/7 support, listening and resolving issues quickly and kindly.",
  },
  {
    icon: FaAward,
    title: "Premium Quality",
    desc: "Carefully selected suppliers with strict QC before shipping.",
  },
  {
    icon: FaBullseye,
    title: "Innovation",
    desc: "Constantly improving shopping experience and operations.",
  },
];

const TEAM = [
  {
    name: "Linh Nguyen",
    role: "Founder & CEO",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "An Tran",
    role: "Head of Product",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Quang Le",
    role: "Engineering Lead",
    avatar:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a6f?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Mai Pham",
    role: "Customer Success",
    avatar:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop",
  },
];

const MILESTONES = [
  {
    year: "2021",
    title: "Launch",
    text: "Opened our online store with the first 100 products.",
  },
  {
    year: "2022",
    title: "Expansion",
    text: "Hit 1,000 products and 10,000 customers.",
  },
  {
    year: "2023",
    title: "Optimization",
    text: "Automated warehouse; 30% faster delivery.",
  },
  {
    year: "2024",
    title: "Regional Growth",
    text: "Serving 12 countries; launched membership.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 pt-16 pb-10 md:pt-24 md:pb-14 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            About Us
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            We craft an{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              amazing
            </span>{" "}
            shopping experience
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            A passionate e‑commerce team focusing on quality products, fast
            delivery, and exceptional after‑sales service.
          </p>

          {/* Quick badges */}
          <div className="mt-6 flex items-center justify-center gap-3 text-xs md:text-sm">
            <Tag color="blue" className="px-3 py-1 rounded-full">
              {" "}
              <FaShippingFast className="inline mr-1" /> Fast Delivery{" "}
            </Tag>
            <Tag color="green" className="px-3 py-1 rounded-full">
              {" "}
              <FaExchangeAlt className="inline mr-1" /> 7‑day Return{" "}
            </Tag>
            <Tag color="gold" className="px-3 py-1 rounded-full">
              {" "}
              <FaLock className="inline mr-1" /> Secure Payment{" "}
            </Tag>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((s, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                  <s.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  {s.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Our Mission
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Bring customers high‑quality products at fair prices with a fast
              and reliable shopping journey.
            </p>
          </Card>
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Our Vision
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Become the most beloved online retail platform in the region,
              where everyone finds what fits their lifestyle.
            </p>
          </Card>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-sm border border-gray-100 h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                  <v.icon className="w-6 h-6 text-gray-800" />
                </div>
                <h4 className="font-semibold text-gray-900">{v.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <Avatar src={m.avatar} size={88} className="mx-auto" />
                <div className="mt-3 font-semibold text-gray-900">{m.name}</div>
                <div className="text-xs text-gray-500">{m.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <Timeline
              items={MILESTONES.map((m) => ({
                color: "blue",
                children: (
                  <div className="flex items-start gap-4">
                    <Tag color="blue" className="mt-0.5">
                      {m.year}
                    </Tag>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {m.title}
                      </div>
                      <div className="text-gray-600 text-sm">{m.text}</div>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Ready to shop smarter?
          </h3>
          <p className="mt-2 text-white/90 max-w-2xl mx-auto">
            Join our newsletter to get exclusive deals, early access to new
            drops, and helpful tips.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-sm px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <Button type="primary" size="large" className="!rounded-full !h-12">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
