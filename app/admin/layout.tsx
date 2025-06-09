import AdminHeader from '@/components/castom/adminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-cyan-400">
      <AdminHeader />
      <main className="p-6 bg-gray-800">{children}</main>
    </div>
  )
}
 