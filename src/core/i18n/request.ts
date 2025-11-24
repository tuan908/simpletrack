import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";


async function getLocale() {
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";
  return locale;
}

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = await getLocale();
  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
