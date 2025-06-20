// lib/utils/dataTransform.ts

export const stageMap = {
  1: "Qualified",
  2: "Contact Made",
  3: "Demo Scheduled",
  4: "Proposal Made",
  5: "Negotiations Started",
  6: "Negotiations Started", // Map stage 6 to Negotiations Started as well
};

export const customStageIdMap = {
  Lead: "00000000-0000-0000-0000-000000000010",
  Qualified: "00000000-0000-0000-0000-000000000011",
  Proposal: "00000000-0000-0000-0000-000000000012",
  Negotiation: "00000000-0000-0000-0000-000000000013",
  "Closed Won": "00000000-0000-0000-0000-000000000014",
  "Closed Lost": "00000000-0000-0000-0000-000000000015",
};

export interface TransformedDeal {
  id: string;
  tenant_id: string;
  organization_id: string;
  stage_id: string;
  primary_contact_id: string | null;
  title: string | null;
  description: string | null;
  value: number | null;
  currency: string | null;
  probability: number | null;
  expected_close_date: string | null;
  actual_close_date: string | null;
  source: string;
  industry: string | null;
  company_size: string | null;
  pain_points: string[];
  next_steps: string[];
  tags: string[];
  custom_fields: Record<string, any>;
  ai_insights: Record<string, any>;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  // stage_name is for UI display only, not stored in database
  stage_name?: string;
}

export interface TransformedContact {
  id: string;
  tenant_id: string;
  organization_id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
}

export interface TransformResult {
  contacts: TransformedContact[];
  deals: TransformedDeal[];
}

export function transformPipedriveDeals(dealsData: any[]): TransformResult {
  const deals: TransformedDeal[] = [];
  const contacts: TransformedContact[] = [];
  const contactIdMap: { [key: string]: string } = {};

  for (const deal of dealsData) {
    const person = deal.person_id;

    // If person exists and hasn't been added, generate a contact entry
    if (person?.value) {
      if (!contactIdMap[person.value]) {
        const generatedContactId = crypto.randomUUID();
        contactIdMap[person.value] = generatedContactId;

        contacts.push({
          id: generatedContactId,
          tenant_id: "00000000-0000-0000-0000-000000000001",
          organization_id: "00000000-0000-0000-0000-000000000002",
          first_name: (person.name || "").split(" ")[0] || null,
          last_name: (person.name || "").split(" ")[1] || null,
          email: person.email?.[0]?.value || null,
          phone: person.phone?.[0]?.value || null,
          address: deal.org_id?.address || null,
          company: deal.org_id?.name || null,
        });

        console.log("🧑 Contact Added:", {
          id: generatedContactId,
          name: person.name,
        });
      }
    }

    // Determine stage name based on Pipedrive stage_id
    const stageName = stageMap[deal.stage_id as keyof typeof stageMap] || null;
    let mappedStage = "Lead"; // default

    // Map Pipedrive stages to our custom stages
    switch (stageName) {
      case "Qualified":
        mappedStage = "Qualified";
        break;
      case "Proposal Made":
        mappedStage = "Proposal";
        break;
      case "Negotiations Started":
        mappedStage = "Negotiation";
        break;
      case "Contact Made":
      case "Demo Scheduled":
        mappedStage = "Lead";
        break;
      default:
        // Check if deal is won or lost based on status
        if (deal.status === "won") {
          mappedStage = "Closed Won";
        } else if (deal.status === "lost") {
          mappedStage = "Closed Lost";
        } else {
          mappedStage = "Lead"; // Default fallback
        }
    }

    const stageId =
      customStageIdMap[mappedStage as keyof typeof customStageIdMap];

    const transformedDeal: TransformedDeal = {
      id: crypto.randomUUID(),
      tenant_id: "00000000-0000-0000-0000-000000000001",
      organization_id: "00000000-0000-0000-0000-000000000002",
      stage_id: stageId,
      primary_contact_id: contactIdMap[person?.value] || null,
      title: deal.title || null,
      description: deal.next_activity_note || null,
      value: deal.value || null,
      currency: deal.currency || null,
      probability: deal.probability || null,
      expected_close_date: deal.expected_close_date || null,
      actual_close_date: deal.won_time || deal.lost_time || null,
      source: "Pipedrive",
      industry: null,
      company_size: null,
      pain_points: [],
      next_steps: [],
      tags: [],
      custom_fields: {},
      ai_insights: {},
      assigned_to: null,
      created_by: null,
      created_at: deal.add_time || null,
      updated_at: deal.update_time || null,
      stage_name: mappedStage, // For UI display only
    };

    deals.push(transformedDeal);

    console.log("📄 Deal Added:", {
      title: deal.title,
      stage: mappedStage,
      primary_contact_id: contactIdMap[person?.value],
    });
  }

  return { contacts, deals };
}

export function transformZohoDeals(apiData: any): TransformResult {
  // Handle both single array and array of arrays format
  const dealsRaw =
    Array.isArray(apiData) && apiData.length > 0 && apiData[0]?.data
      ? apiData[0].data
      : Array.isArray(apiData)
      ? apiData
      : [];

  const contactsRaw =
    Array.isArray(apiData) && apiData.length > 1 && apiData[1]?.data
      ? apiData[1].data
      : [];

  const deals: TransformedDeal[] = [];
  const contacts: TransformedContact[] = [];
  const contactIdMap: { [key: string]: string } = {};

  for (const deal of dealsRaw) {
    const contactRef = deal.Contact_Name;
    const contactId = contactRef?.id;

    // Find full contact details
    let fullContact = null;
    if (contactId) {
      fullContact = contactsRaw.find((c: any) => c.id === contactId);
    }

    // Process contact if it exists and hasn't been added
    if (contactId && !contactIdMap[contactId]) {
      const generatedContactId = crypto.randomUUID();
      contactIdMap[contactId] = generatedContactId;

      const address = fullContact
        ? [
            fullContact.Mailing_Street,
            fullContact.Mailing_City,
            fullContact.Mailing_State,
            fullContact.Mailing_Country,
            fullContact.Mailing_Zip,
          ]
            .filter(Boolean)
            .join(", ")
        : null;

      contacts.push({
        id: generatedContactId,
        tenant_id: "00000000-0000-0000-0000-000000000001",
        organization_id: "00000000-0000-0000-0000-000000000002",
        first_name:
          fullContact?.First_Name || contactRef?.name?.split(" ")[0] || null,
        last_name:
          fullContact?.Last_Name ||
          contactRef?.name?.split(" ").slice(1).join(" ") ||
          null,
        email: fullContact?.Email || null,
        phone: fullContact?.Phone || null,
        address: address,
        company:
          fullContact?.Account_Name?.name || deal.Account_Name?.name || null,
      });

      console.log("🧑 Contact Added:", {
        id: generatedContactId,
        name:
          `${fullContact?.First_Name || ""} ${
            fullContact?.Last_Name || ""
          }`.trim() || contactRef?.name,
      });
    }

    // Map Zoho stages to our custom stages
    let mappedStage = "Lead";
    const zohoStage = deal.Stage?.toLowerCase();

    switch (zohoStage) {
      case "qualification":
      case "qualified":
        mappedStage = "Qualified";
        break;
      case "proposal/price quote":
      case "proposal":
        mappedStage = "Proposal";
        break;
      case "negotiation/review":
      case "negotiation":
        mappedStage = "Negotiation";
        break;
      case "closed won":
        mappedStage = "Closed Won";
        break;
      case "closed lost":
        mappedStage = "Closed Lost";
        break;
      default:
        // Handle additional Zoho stages based on your sample data
        if (zohoStage?.includes("needs analysis")) {
          mappedStage = "Lead";
        } else if (zohoStage?.includes("identify decision makers")) {
          mappedStage = "Lead";
        } else if (zohoStage?.includes("value proposition")) {
          mappedStage = "Lead";
        } else {
          mappedStage = "Lead";
        }
    }

    const stageId =
      customStageIdMap[mappedStage as keyof typeof customStageIdMap];

    const transformedDeal: TransformedDeal = {
      id: crypto.randomUUID(),
      tenant_id: "00000000-0000-0000-0000-000000000001",
      organization_id: "00000000-0000-0000-0000-000000000002",
      stage_id: stageId,
      primary_contact_id: contactIdMap[contactId] || null,
      title: deal.Deal_Name || null,
      description: deal.Description || null,
      value: deal.Amount || null,
      currency: deal.$currency_symbol === "$" ? "USD" : deal.Currency || "USD",
      probability: deal.Probability || null,
      expected_close_date: deal.Closing_Date || null,
      actual_close_date: deal.Closed_Time || null,
      source: "Zoho",
      industry: null,
      company_size: null,
      pain_points: [],
      next_steps: [],
      tags: deal.Tag || [],
      custom_fields: {},
      ai_insights: {},
      assigned_to: null,
      created_by: null,
      created_at: deal.Created_Time || null,
      updated_at: deal.Modified_Time || null,
      stage_name: mappedStage, // For UI display only
    };

    deals.push(transformedDeal);

    console.log("📄 Deal Added:", {
      title: deal.Deal_Name,
      stage: mappedStage,
      primary_contact_id: contactIdMap[contactId],
    });
  }

  return { contacts, deals };
}

export function transformHubSpotDeals(dealsData: any[]): TransformResult {
  const deals: TransformedDeal[] = [];
  const contacts: TransformedContact[] = [];
  const contactIdMap: { [key: string]: string } = {};

  for (const deal of dealsData) {
    const contact = deal.contacts; // Based on your sample structure

    // Process contact if it exists and hasn't been added
    if (contact?.id) {
      if (!contactIdMap[contact.id]) {
        const generatedContactId = crypto.randomUUID();
        contactIdMap[contact.id] = generatedContactId;

        contacts.push({
          id: generatedContactId,
          tenant_id: "00000000-0000-0000-0000-000000000001",
          organization_id: "00000000-0000-0000-0000-000000000002",
          first_name: contact.first_name || null,
          last_name: contact.last_name || null,
          email: contact.email || null,
          phone: contact.phone || null,
          address: contact.address || null,
          company: contact.company || null,
        });

        console.log("🧑 Contact Added:", {
          id: generatedContactId,
          name: `${contact.first_name || ""} ${contact.last_name || ""}`.trim(),
        });
      }
    }

    // Map HubSpot deal stages
    let mappedStage = "Lead";
    const hubspotStage = deal.stage?.toLowerCase();

    switch (hubspotStage) {
      case "qualifiedtobuy":
      case "qualified":
        mappedStage = "Qualified";
        break;
      case "presentationscheduled":
      case "appointmentscheduled":
      case "decisionmakerbroughtin":
        mappedStage = "Proposal";
        break;
      case "contractsent":
        mappedStage = "Negotiation";
        break;
      case "closedwon":
        mappedStage = "Closed Won";
        break;
      case "closedlost":
        mappedStage = "Closed Lost";
        break;
      default:
        mappedStage = "Lead";
    }

    const stageId =
      customStageIdMap[mappedStage as keyof typeof customStageIdMap];

    const transformedDeal: TransformedDeal = {
      id: crypto.randomUUID(),
      tenant_id: "00000000-0000-0000-0000-000000000001",
      organization_id: "00000000-0000-0000-0000-000000000002",
      stage_id: stageId,
      primary_contact_id: contactIdMap[contact?.id] || null,
      title: deal.name || null,
      description: deal.description || null,
      value: deal.value ? parseFloat(deal.value) : null,
      currency: deal.currency || "USD",
      probability: null,
      expected_close_date: deal.closeDate || null,
      actual_close_date: null, // HubSpot sample doesn't show this field
      source: "HubSpot",
      industry: null,
      company_size: null,
      pain_points: [],
      next_steps: [],
      tags: [],
      custom_fields: {},
      ai_insights: {},
      assigned_to: null,
      created_by: null,
      created_at: deal.created_at || null,
      updated_at: deal.updated_at || null,
      stage_name: mappedStage, // For UI display only
    };

    deals.push(transformedDeal);

    console.log("📄 Deal Added:", {
      title: deal.name,
      stage: mappedStage,
      primary_contact_id: contactIdMap[contact?.id],
    });
  }

  return { contacts, deals };
}

// Main transform function that handles different platforms
export function transformDeals(
  dealsData: any,
  platform: string
): TransformResult {
  switch (platform.toLowerCase()) {
    case "pipedrive":
      return transformPipedriveDeals(dealsData);
    case "zoho":
      return transformZohoDeals(dealsData);
    case "hubspot":
      return transformHubSpotDeals(dealsData);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

// Database insertion function
export async function insertTransformedData(
  { contacts, deals }: TransformResult,
  supabaseClient: any
): Promise<void> {
  try {
    // Insert contacts first (if any)
    if (contacts.length > 0) {
      const { error: contactError } = await supabaseClient
        .from("contacts")
        .insert(contacts);

      if (contactError) {
        console.error("❌ Failed to insert contacts:", contactError);
        throw new Error(`Contact insertion failed: ${contactError.message}`);
      }
      console.log(`✅ Inserted ${contacts.length} contacts`);
    }

    // Insert deals next (if any) - remove stage_name before inserting
    if (deals.length > 0) {
      const dealsForDB = deals.map((deal) => {
        const { stage_name, ...dealWithoutStageName } = deal;
        return dealWithoutStageName;
      });

      const { error: dealError } = await supabaseClient
        .from("deals")
        .insert(dealsForDB);

      if (dealError) {
        console.error("❌ Failed to insert deals:", dealError);
        throw new Error(`Deal insertion failed: ${dealError.message}`);
      }
      console.log(`✅ Inserted ${deals.length} deals`);
    }

    console.log("🎉 Data insertion completed successfully!");
  } catch (err) {
    console.error("🔥 Insert Error:", err);
    throw err;
  }
}
