-- View for deal pipeline analytics
CREATE OR REPLACE VIEW deal_pipeline_view AS
SELECT 
    d.tenant_id,
    ds.name as stage_name,
    ds.order_index,
    COUNT(d.id) as deal_count,
    SUM(d.value) as total_value,
    AVG(d.probability) as avg_probability
FROM deals d
JOIN deal_stages ds ON d.stage_id = ds.id
GROUP BY d.tenant_id, ds.id, ds.name, ds.order_index
ORDER BY d.tenant_id, ds.order_index;

-- View for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    a.tenant_id,
    a.created_by as user_id,
    u.first_name,
    u.last_name,
    COUNT(a.id) as total_activities,
    COUNT(CASE WHEN a.type = 'call' THEN 1 END) as calls,
    COUNT(CASE WHEN a.type = 'email' THEN 1 END) as emails,
    COUNT(CASE WHEN a.type = 'meeting' THEN 1 END) as meetings,
    COUNT(CASE WHEN a.completed_at IS NOT NULL THEN 1 END) as completed_activities
FROM activities a
JOIN users u ON a.created_by = u.id
GROUP BY a.tenant_id, a.created_by, u.first_name, u.last_name;

-- View for deal performance metrics
CREATE OR REPLACE VIEW deal_performance_metrics AS
SELECT 
    d.tenant_id,
    d.assigned_to as user_id,
    COUNT(d.id) as total_deals,
    COUNT(CASE WHEN ds.is_won = true THEN 1 END) as won_deals,
    COUNT(CASE WHEN ds.is_closed = true AND ds.is_won = false THEN 1 END) as lost_deals,
    SUM(CASE WHEN ds.is_won = true THEN d.value ELSE 0 END) as won_value,
    AVG(d.value) as avg_deal_value,
    AVG(d.probability) as avg_probability
FROM deals d
JOIN deal_stages ds ON d.stage_id = ds.id
GROUP BY d.tenant_id, d.assigned_to;
