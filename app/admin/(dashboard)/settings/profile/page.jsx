import { getAdminProfile } from "@/actions/admin/profile";
import ProfileForm from "./_components/ProfileForm";

export const metadata = { title: "My Profile" };

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ivory">
          My <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Profile</span>
        </h1>
        <p className="text-sm text-ivory/50 font-light mt-1">Update your admin account details.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
