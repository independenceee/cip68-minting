"use client";

import Action from "./action";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Users } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="relative flex min-h-screen items-center overflow-hidden bg-transparent">
            <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="mb-6 flex items-center justify-center gap-4">
                            <div className="h-1.5 w-12 rounded-full bg-linear-to-r from-blue-500 to-violet-500"></div>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                                Get in Touch with CIP68
                            </h2>
                            <div className="h-1.5 w-12 rounded-full bg-linear-to-r from-violet-500 to-cyan-500"></div>
                        </div>

                        <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300 md:text-xl">
                            Have questions about CIP68 setup on Cardano? Want to report a bug, suggest a feature, or explore collaboration
                            opportunities?
                            <br className="hidden sm:block" />
                            <strong className="text-blue-600 dark:text-blue-400">
                                We are here to help build a more secure and transparent ecosystem together.
                            </strong>
                        </p>
                    </div>

                    {/* Alternative contact methods */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                desc: "For support, inquiries, or partnerships",
                                link: "mailto:support@multisigtreasury.io",
                                label: "support@multisigtreasury.io",
                            },
                            {
                                icon: MessageSquare,
                                title: "Join Discord",
                                desc: "Chat live with the team & community",
                                link: "https://discord.gg/multisigtreasury", // thay link thật nếu có
                                label: "Discord Community",
                            },
                            {
                                icon: Users,
                                title: "Follow on X",
                                desc: "Latest updates & announcements",
                                link: "https://x.com/multisigtreasury", // thay handle thật
                                label: "@multisigtreasury",
                            },
                        ].map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex flex-col items-center text-center rounded-[1.3rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-blue-500/50"
                            >
                                <item.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                <span className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">{item.label}</span>
                            </motion.a>
                        ))}
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mx-auto max-w-4xl overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/85 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75"
                    >
                        <div className="p-8 lg:p-10">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your full name"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your.email@example.com"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="e.g. Multisig Setup Question, Feature Request, Bug Report"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            placeholder="Tell us how we can help you with CIP68 on Cardano..."
                                            rows={5}
                                            required
                                            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mx-auto flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-10 py-4 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:w-auto"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Your Message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Action title="Back to Top" href="#Landing" />
        </section>
    );
}
