import { FormEvent, useState } from "react";
import { Award, Download, CreditCard, Printer, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAuth } from "../../context/AuthContext";
import {
  useCertificateAccess,
  usePurchaseCertificate,
  useRequestCertificateHardCopy,
} from "../../hooks/useCertificates";
import {
  CERTIFICATE_PRICE,
  CERTIFICATE_HARDCOPY_FEE,
  formatPrice,
} from "../../lib/trainingContent";
import { generateCertificatePdf } from "../../lib/certificate";

// Pay-then-download certificate for a passed assessment, plus a paid hard-copy
// (printed/shipped) request once the certificate is owned.
export const CertificateAction = ({
  assessmentId,
  courseTitle,
  scoreLabel,
  className,
}: {
  assessmentId: string;
  courseTitle: string;
  scoreLabel: string;
  className?: string;
}) => {
  const { user } = useAuth();
  const { data: access } = useCertificateAccess();
  const purchase = usePurchaseCertificate();
  const hardCopy = useRequestCertificateHardCopy();

  const [hcOpen, setHcOpen] = useState(false);
  const [hcForm, setHcForm] = useState(() => ({
    full_name: user?.full_name ?? "",
    address: "",
    city: "",
    country: "",
  }));

  const owned = !!access?.unlocked?.includes(assessmentId);
  const certId = `WV-${assessmentId.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}`;

  const download = () =>
    generateCertificatePdf({
      name: user?.full_name || "Candidate",
      courseTitle,
      dateLabel: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      scoreLabel,
      certId,
    });

  const buy = () =>
    purchase.mutate(assessmentId, {
      onSuccess: () => toast.success("Certificate unlocked"),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Payment failed"),
    });

  const submitHardCopy = (e: FormEvent) => {
    e.preventDefault();
    hardCopy.mutate(
      { assessmentId, details: hcForm },
      {
        onSuccess: () => {
          toast.success("Hard-copy certificate request received");
          setHcOpen(false);
          hardCopy.reset();
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Request failed"),
      }
    );
  };
  const hcValid = hcForm.full_name && hcForm.address && hcForm.city && hcForm.country;

  if (!owned) {
    return (
      <Button className={className} onClick={buy} disabled={purchase.isPending}>
        <Award className="w-4 h-4 mr-2" />
        {purchase.isPending ? "Processing..." : `Get Certificate · ${formatPrice(CERTIFICATE_PRICE)}`}
      </Button>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Button
        variant="secondary"
        className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
        onClick={download}
      >
        <Download className="w-4 h-4 mr-2" /> Download Certificate
      </Button>

      <Dialog open={hcOpen} onOpenChange={setHcOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Printer className="w-4 h-4 mr-2" /> Request hard copy ·{" "}
            {formatPrice(CERTIFICATE_HARDCOPY_FEE)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a printed certificate</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 -mt-1">
            {courseTitle} · a printed, framed certificate shipped to you for{" "}
            {formatPrice(CERTIFICATE_HARDCOPY_FEE)}.
          </p>
          <form onSubmit={submitHardCopy} className="space-y-3 mt-1">
            <Input
              placeholder="Full name"
              value={hcForm.full_name}
              onChange={(e) => setHcForm((f) => ({ ...f, full_name: e.target.value }))}
            />
            <Input
              placeholder="Delivery address"
              value={hcForm.address}
              onChange={(e) => setHcForm((f) => ({ ...f, address: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="City"
                value={hcForm.city}
                onChange={(e) => setHcForm((f) => ({ ...f, city: e.target.value }))}
              />
              <Input
                placeholder="Country"
                value={hcForm.country}
                onChange={(e) => setHcForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!hcValid || hardCopy.isPending}>
              {hardCopy.isPending ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" /> Pay{" "}
                  {formatPrice(CERTIFICATE_HARDCOPY_FEE)} &amp; request
                </>
              )}
            </Button>
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Secure checkout · ships in 7–10 days
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
