import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateInquiry, deleteInquiry } from "@/actions/inquiries";
import { PageHead, StatusBadge, Field } from "@/components/studio/server-ui";
import { ConfirmDelete, SubmitButton } from "@/components/studio/ui";
import { INQUIRY_STATUS } from "@/lib/constants";

export default async function InquiryPage({ params }: PageProps<"/studio/inquiries/[id]">) {
  const { id } = await params;
  const i = await db.inquiry.findUnique({ where: { id: Number(id) } });
  if (!i) notFound();

  const rows: [string, string | null][] = [
    ["EMAIL", i.email],
    ["COMPANY", i.company],
    ["IMPROVE", i.improve],
    ["NEED", i.need],
    ["BUDGET", i.budget],
    ["TIMELINE", i.timeline],
    ["SOURCE", i.source],
    ["RECEIVED", i.createdAt.toLocaleString("en-GB")],
    ["UPDATED", i.updatedAt.toLocaleString("en-GB")],
  ];
  const mailto = `mailto:${i.email}?subject=${encodeURIComponent("Re: your EUNΟIA inquiry")}`;

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <Link href="/studio/inquiries" className="t-meta text-gray hover:text-accent">
          ← INQUIRIES
        </Link>
        <StatusBadge s={i.status} />
        <span className="ml-auto">
          <ConfirmDelete action={deleteInquiry} id={i.id} />
        </span>
      </div>
      <PageHead title={i.name} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border border-line-light bg-white p-4 text-sm sm:grid-cols-3">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="t-meta text-gray">{k}</dt>
                <dd>{v || "—"}</dd>
              </div>
            ))}
          </dl>
          <section className="border border-line-light bg-white p-4">
            <h2 className="t-meta mb-2 text-gray">THE PROBLEM (THEIR WORDS)</h2>
            <p className="whitespace-pre-wrap">{i.problem}</p>
          </section>
          <section className="border border-line-light bg-white p-4">
            <h2 className="t-meta mb-2 text-gray">MESSAGE</h2>
            <p className="whitespace-pre-wrap">{i.message}</p>
          </section>
          <a href={mailto} className="t-meta-lg inline-flex min-h-[44px] items-center border border-ink px-5 hover:bg-ink hover:text-paper">
            REPLY BY EMAIL ↗
          </a>
        </div>
        <form action={updateInquiry} className="space-y-4 self-start border border-line-light bg-white p-4">
          <input type="hidden" name="id" value={i.id} />
          <Field label="STATUS" name="status" value={i.status} options={INQUIRY_STATUS} />
          <Field label="NEXT ACTION" name="nextAction" value={i.nextAction} />
          <Field label="NOTES" name="notes" value={i.notes} rows={6} />
          <SubmitButton>SAVE</SubmitButton>
        </form>
      </div>
    </div>
  );
}
