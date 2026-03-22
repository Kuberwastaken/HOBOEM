import { HomePage } from "@/components/home/home-page";
import { getBannerImages } from "@/lib/banner-images";

export const revalidate = 60;

export default function Page() {
    const bannerImages = getBannerImages();

    return <HomePage bannerImages={bannerImages} />;
}
