import { AppSidebar } from "@/components/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/components/ui/sidebar"

export default function Page({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        { children }
      </SidebarInset>
    </SidebarProvider>
  )
}
