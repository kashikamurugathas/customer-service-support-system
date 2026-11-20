export const GET_AGENTS_QUERY = `
  query GetAgents($search: String, $status: String, $page: Int, $pageSize: Int) {
    allAgents(search: $search, status: $status, page: $page, pageSize: $pageSize) {
      items {
        agentId
        department
        availabilityStatus
        userId {
          fullName
          email
          role
          createdAt
        }
      }
      pagination {
        totalItems
      }
    }
  }
`;

export const GET_AGENT_BY_ID_QUERY = `
  query GetAgentById($agentId: Int!) {
    agentById(agentId: $agentId) {
      agentId
      department
      availabilityStatus
      userId {
        fullName
        email
        role
        createdAt
      }
    }
  }
`;
