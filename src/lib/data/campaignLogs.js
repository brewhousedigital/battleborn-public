export const getCampaignLogs = async(campaignId) => {
    let whereClause = `campaign_id = '${campaignId}'`;
    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);

    return await Backendless.Data.of("d20_campaign_logs").find(queryBuilder)
}