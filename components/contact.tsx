"use client";

import Action from "./action";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Users } from "lucide-react";

export default function Contact() {
    return (
        <section
            id="contact"
            className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-slate-900/50 dark:to-slate-950/30"
        >
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
                        <div className="mb-6 flex items-center justify-center gap-6">
                            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                                Get in Touch with Multisig Treasury
                            </h2>
                            <div className="h-1.5 w-16 bg-gradient-to-r from-transparent to-cyan-500 rounded-full"></div>
                        </div>

                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                            Have questions about multisig treasury setup on Cardano? Want to report a bug, suggest a feature, discuss DAO governance,
                            or explore collaboration opportunities?
                            <br className="hidden sm:block" />
                            <strong className="text-blue-600 dark:text-blue-400">
                                We're here to help build a more secure and transparent ecosystem together.
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
                                className="group flex flex-col items-center text-center p-6 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
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
                        className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden max-w-4xl mx-auto"
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
                                            placeholder="Tell us how we can help you with Multisig Treasury on Cardano..."
                                            rows={5}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto mx-auto flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
