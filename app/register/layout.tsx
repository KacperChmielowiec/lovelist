export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-gray-900">
      <main className="h-full">{children}</main>
    </div>
  )
}