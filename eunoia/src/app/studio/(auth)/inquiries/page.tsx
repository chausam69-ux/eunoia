import Link from "next/link";
import { db } from "@/lib/db";
import { PageHead, StatusBadge, EmptyState, th, td } from "@/components/studio/server-ui";
import { INQUIRY_STATUS } from "@/lib/constants";

export default async function InquiriesPage({ searchParams }: PageProps<"/studio/inquiries">) {
  const { status } = await searchParams;
  const active = typeof status === "string" && INQUIRY_STATUS.includes(status) ? status : "";
  const items = await db.inquiry.findMany({
    where: active ? { status: active } : { status: { notIn: ["ARCHIVED"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHead title="INQUIRIES" count={items.length} />
      <nav aria-label="Filter" className="mb-6 flex flex-wrap gap-2">
        <Link href="/studio/inquiries" className={`t-meta px-3 py-2 ${!active ? "bg-ink text-paper" : "border border-line-light"}`}>
          ACTIVE
        </Link>
        {INQUIRY_STATUS.map((s) => (
          <Link
            key={s}
            href={`/studio/inquiries?status=${s}`}
            className={`t-meta px-3 py-2 ${active === s ? "bg-ink text-paper" : "border border-line-light"}`}
          >
            {s}
          </Link>
        ))}
      </nav>
      {items.length === 0 ? (
        <EmptyState text="No inquiries here. The /start form on the public site creates them." href="/start" label="OPEN /START ↗" />
      ) : (
        <div className="overflow-x-auto border border-line-light bg-white">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className={th}>FROM</th>
                <th className={th}>IMPROVE</th>
                <th className={th}>NEED</th>
                <th className={th}>BUDGET</th>
                <th className={th}>STATUS</th>
                <th className={th}>NEXT ACTION</th>
                <th className={th}>RECEIVED</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t border-line-light">
                  <td className={td}>
                    <Link href={`/studio/inquiries/${i.id}`} className="font-medium underline-offset-4 hover:underline">
                      {i.name}
                    </Link>
                    <div className="text-xs text-gray">
                      {i.company ?? "—"} · {i.email}
                    </div>
                  </td>
                  <td className={`${td} t-meta`}>{i.improve}</td>
                  <td className={`${td} t-meta`}>{i.need}</td>
                  <td className={`${td} text-gray`}>{i.budget ?? "—"}</td>
                  <td className={td}>
                    <StatusBadge s={i.status} />
                  </td>
                  <td className={`${td} text-gray`}>{i.nextAction || "—"}</td>
                  <td className={`${td} text-gray`}>{i.createdAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
