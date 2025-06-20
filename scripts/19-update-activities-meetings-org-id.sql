-- Ensure organization_id columns are properly configured in activities and meetings tables

-- Update activities table
ALTER TABLE activities 
ADD CONSTRAINT fk_activities_organization 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- Update meetings table  
ALTER TABLE meetings
ADD CONSTRAINT fk_meetings_organization
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_organization_id ON activities(organization_id);
CREATE INDEX IF NOT EXISTS idx_meetings_organization_id ON meetings(organization_id);

-- Update existing records to set organization_id based on deal's organization_id
UPDATE activities 
SET organization_id = (
    SELECT d.organization_id 
    FROM deals d 
    WHERE d.id = activities.deal_id
)
WHERE deal_id IS NOT NULL AND organization_id IS NULL;

UPDATE meetings 
SET organization_id = (
    SELECT d.organization_id 
    FROM deals d 
    WHERE d.id = meetings.deal_id
)
WHERE deal_id IS NOT NULL AND organization_id IS NULL;

-- For activities without deals, try to get organization_id from contact
UPDATE activities 
SET organization_id = (
    SELECT c.organization_id 
    FROM contacts c 
    WHERE c.id = activities.contact_id
)
WHERE contact_id IS NOT NULL AND organization_id IS NULL;
