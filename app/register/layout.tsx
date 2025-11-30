export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full bg-gray-900">
      <main className="min-h-full">{children}</main>
    </div>
  )
}