"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Arrow1,
  Arrow2,
  Comedy,
  Dance,
  Poetry,
  Sing,
  Triangle,
} from "@/components/assets/icons/Landing";
import Video from "@/components/assets/images/video.png";
import Phone from "@/components/assets/images/phone.png";
import Instagram from "@/components/assets/images/instagram.png";
import Engagement from "@/components/assets/images/engagement.png";
import Star from "@/components/assets/images/star.png";
import { LandingContainer } from "@/components/ui/containers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MarqueeStrip } from "@/components/Marquee";
import { FAQ } from "@/components/Faq";

export default function App() {
  const stepsRef = useRef(null);

  const talentTypes = [
    {
      title: "Singing",
      icon: Sing,
      className: "!-rotate-6",
    },
    {
      title: "Dancing",
      icon: Dance,
      className: "-bottom-10",
    },
    {
      title: "Poetry",
      icon: Poetry,
      className: "",
    },
    {
      title: "Comedy",
      icon: Comedy,
      className: "!rotate-6 -bottom-10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EBE2D7]">
      <div className="sm:p-3 md:p-4">
        <div className="bg-[#131313] pt-6 sm:pt-4 sm:px-4 sm:rounded-xl text-white">
          <LandingContainer>
            <div className="mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  width={100}
                  height={100}
                  src="/Logo.png"
                  alt="OYOYO"
                  // className="h-[60px] w-[100px]"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://play.google.com/store/apps/details?id=com.lassod.oyoyoevents&hl=vn"
                  className="text-sm text-gray-300"
                >
                  Download app
                </Link>
              </motion.div>
            </div>
          </LandingContainer>

          <LandingContainer className="overflow-hidden">
            <div className="mx-auto pt-20 text-center relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-12"
              >
                <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
                  <div className="w-4 h-4 bg-gray-700 flex items-center justify-center rounded-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    ></motion.div>
                  </div>
                  <span className="text-white text-sm font-medium">
                    Oyoyo Star Hunt
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-7"
              >
                <div className="flex items-center flex-col sm:gap-2">
                  <div className="flex items-center justify-center">
                    <Triangle />
                    <h1>Who dey blow?</h1>
                  </div>
                  <h1>Your stage awaits!</h1>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center mb-12 leading-[1.5] relative max-w-[500px] mx-auto"
              >
                <span className="text-white text-lg">
                  It's your moment to shine on the Oyoyo Talent Stage 2025 with
                  over{" "}
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    className="font-[900] text-[30px]"
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ₦2,000,000
                  </motion.span>{" "}
                  up for grab!
                </span>
              </motion.div>
              <motion.div
                className="absolute right-[25%] top-[50%] text-green-500"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <path d="M16 0L19.5 9.8L32 11.5L22.2 19.5L25.8 32L16 24L6.2 32L9.8 19.5L0 11.5L12.5 9.8L16 0Z" />
                </motion.svg>

                <motion.div
                  className="absolute inset-0 text-green-400"
                  animate={{
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    opacity: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                  >
                    <path d="M16 0L19.5 9.8L32 11.5L22.2 19.5L25.8 32L16 24L6.2 32L9.8 19.5L0 11.5L12.5 9.8L16 0Z" />
                  </svg>
                </motion.div>

                <motion.div
                  className="absolute inset-0 blur-sm text-green-300"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                  >
                    <path d="M16 0L19.5 9.8L32 11.5L22.2 19.5L25.8 32L16 24L6.2 32L9.8 19.5L0 11.5L12.5 9.8L16 0Z" />
                  </svg>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-16"
              >
                <Link
                  target="_blank"
                  href="https://www.instagram.com/oyoyoeventsapp?igsh=MWl2eHJlMDd4cmxicg=="
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-700 hover:bg-red-700 text-white px-4 sm:px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center space-x-3 mx-auto"
                  >
                    <span>Submit entry video</span>
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </motion.svg>
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-16"
              >
                <div className="max-w-4xl relative mx-auto">
                  <div className="grid grid-cols-2 relative -bottom-6 md:grid-cols-4 gap-2">
                    {talentTypes.map((item, i: number) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className={cn(
                          "rounded-[20px] relative p-3 sm:p-4 h-[240px] shadow-lg flex items-center flex-col text-center transition-all duration-300 hover:shadow-xl",
                          item.className
                        )}
                        style={{ backgroundColor: "#EBE2D7" }}
                      >
                        <span className="text-gray-800 text-[16px] sm:text-[20px]">
                          {item.title}
                        </span>
                        <item.icon />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full opacity-60"
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="absolute top-40 right-20 w-1 h-1 bg-green-500 rounded-full opacity-60"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute bottom-40 left-20 w-3 h-3 bg-red-500 rounded-full opacity-40"
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </LandingContainer>
        </div>

        <LandingContainer>
          <section
            ref={stepsRef}
            className="px-6 pt-[80px] md:pt-[130px] pb-[200px] md:pb-[40px] relative"
            style={{ backgroundColor: "#E8E2D4" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center flex flex-col md:gap-6 max-w-[600px] mx-auto"
            >
              <h2>Ready to Be The Next Superstar?</h2>
              <span className="text-gray-600 text-lg">
                Here's How to Audition:
              </span>
            </motion.div>
            <Arrow1 />

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative top-10 md:-top-12"
            >
              <div className="flex items-center justify-center md:items-start md:justify-start max-w-[450px] flex-col gap-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 animate-bounce h-10 md:w-16 md:h-16 bg-red-700 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg mx-auto md:mx-0"
                >
                  1
                </motion.div>
                <div className="flex flex-col sm:flex-row sm:gap-7 sm:items-center space-y-2">
                  <Image
                    src={Video}
                    alt="Film your audition"
                    width={400}
                    height={400}
                    className="w-48 h-32 md:w-56 md:h-36 object-cover rounded-2xl shadow-lg"
                  />

                  <div className="flex gap-2 flex-col items-center justify-center md:items-start md:justify-start">
                    <h3>Film your audition video</h3>
                    <p>(max 60 seconds)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <Arrow2 />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative top-20 md:-top-20"
            >
              <div className="w-full flex items-end justify-end">
                <div className="flex items-center md:items-end justify-center mx-auto sm:mr-0 md:justify-end max-w-[500px] flex-col gap-5">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 animate-bounce h-10 md:w-16 md:h-16 bg-red-700 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg mx-auto md:mx-0"
                  >
                    2
                  </motion.div>
                  <div className="flex gap-3 flex-col-reverse sm:flex-row sm:gap-10 sm:items-center space-y-2">
                    <div className="flex gap-2 flex-col items-center justify-center md:items-start md:justify-start">
                      <h3>Post on Instagram</h3>
                      <p className="text-black">
                        tag, follow and collaborate with:
                      </p>
                      <p>@oyoyoeventsapp</p>
                      <p>
                        <span className="text-black">Hashtags:</span>{" "}
                        #OyoyoStarHunt
                      </p>
                      <p>#WhoDeyBlow</p>
                    </div>

                    <Image
                      src={Instagram}
                      alt="Film your audition"
                      width={400}
                      height={400}
                      className="w-48 h-32 md:w-56 md:h-36 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="scale-x-[-1]">
              <Arrow2 />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative top-32 md:-top-20"
            >
              <div className="flex max-w-[450px] flex-col gap-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 animate-bounce h-10 md:w-16 md:h-16 bg-red-700 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg mx-auto md:mx-0"
                >
                  3
                </motion.div>
                <div className="flex items-center md:items-start gap-2 flex-col sm:flex-row sm:gap-7 sm:items-center space-y-2">
                  <Image
                    src={Engagement}
                    alt="Film your audition"
                    width={400}
                    height={400}
                    className="w-48 h-32 md:w-56 md:h-36 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="flex gap-2 flex-col items-center justify-center md:items-start md:justify-start">
                    <h3>Engagement</h3>
                    <p>
                      Encourage people to like, share, and comment on your
                      video!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </LandingContainer>
      </div>
      <MarqueeStrip />
      <div className="sm:p-4 bg-black py-[30px] md:py-[150px]">
        <LandingContainer>
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 text-lg tracking-wider md:pt-24">
                FAQ'S
              </p>
              <h2 className="text-white font-medium md:text-[50px]">
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </motion.div>
            <FAQ />
          </motion.section>
        </LandingContainer>
        <LandingContainer>
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 text-lg tracking-wider pt-24">
                ABOUT
              </p>
              <h2 className="text-white font-medium md:text-[50px]">
                OYOYO EVENTS APP
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Oyoyo Events App is an innovative social platform dedicated to
                  revolutionizing the event and entertainment industry. More
                  than just the ticketing feature, Oyoyo serves as a
                  comprehensive ecosystem designed to connect, empower, and
                  simplify every aspect of event management and participation.
                </p>

                <div className="mb-8">
                  <h3 className="text-white mb-6">
                    Why Choose Oyoyo Events App?
                  </h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <Reveal key={index}>
                        <div key={index} className="flex items-start space-x-3">
                          <Image
                            src={Star}
                            alt="Star"
                            className=""
                            width={30}
                            height={30}
                          />
                          {/* Text */}
                          <div>
                            <p className="text-gray-300 font-medium">
                              {feature.title}
                            </p>
                            <p className="text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative"
                >
                  <Image
                    src={Phone}
                    alt="Oyoyo Events App"
                    className="max-w-full h-auto"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
          <div className="mx-auto pt-[100px] text-center">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
              {/* Left: Socials */}
              <div className="flex md:justify-start justify-center">
                <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  {socials.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      aria-label={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-[#1a1a1a] transition hover:border-white/10 hover:bg-[#222]"
                    >
                      <item.icon className="h-4 w-4 text-white/90 transition group-hover:text-white" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Center: Logo + App label */}
              <div className="text-center">
                <Link href="/" className="inline-flex flex-col items-center">
                  <Image src="/Logo.png" alt="Logo" width={100} height={100} />
                </Link>
              </div>

              {/* Right: Copyright */}
              <div className="md:justify-end flex justify-center">
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <Copyright className="h-4 w-4" />
                  <span>{2025} Oyoyo. All rights reserved.</span>
                </p>
              </div>
            </div>
          </div>
        </LandingContainer>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Reducing Stress",
    description:
      "Simplifies Complex Tasks, Allowing You To Focus On Creativity",
  },
  {
    title: "Enhancing Efficiency",
    description: "Streamlines Workflows With Integrated Tools And Features",
  },
  {
    title: "Increasing Visibility",
    description: "Promotes Your Events And Vendor Services To A Wider Audience",
  },
  {
    title: "Improving Communication",
    description:
      "Facilitates Seamless Interaction Between Planners, Vendors And Attendees",
  },
];

// components/Footer.tsx
import Link from "next/link";
import { Facebook, Linkedin, Copyright } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Reveal } from "@/components/Reveal";

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://wa.me/2340000000000", label: "WhatsApp", icon: FaWhatsapp },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
];
