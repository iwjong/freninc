export const studioEmail = "support@freninc.com";

export function emailDraftUrl(
  subject = "Project inquiry",
  body = "Hello,\n\nSetting: \nPeople who will use it: \nWhat you hope to make possible: \n\nName: \nOrganization: \n",
) {
  const url = new URL("https://mail.google.com/mail/");
  url.search = new URLSearchParams({ view: "cm", fs: "1", to: studioEmail, su: subject, body }).toString();
  return url.href;
}
