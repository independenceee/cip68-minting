import { source } from "@/libs/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/libs/layout.shared";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function Layout({ children }: LayoutProps<"/document">) {
    return (
        <RootProvider>
            <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
                {children}
            </DocsLayout>
        </RootProvider>
    );
}
