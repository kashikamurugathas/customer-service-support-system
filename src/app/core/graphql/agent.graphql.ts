export const GET_AGENTS_QUERY = `
  query GetAgents($search: String, $status: String, $ordering: String, $page: Int, $pageSize: Int) {
    agents(search: $search, status: $status, ordering: $ordering, page: $page, pageSize: $pageSize) {
      totalCount
      page
      pageSize
      results {
        id
        agentId
        name
        email
        phone
        department
        role
        status
        createdAt
      }
    }
  }
`;

export const GET_AGENT_STATS_QUERY = `
  query GetAgentStats {
    agentStats {
      totalAgents
      activeAgents
      inactiveAgents
      availableAgents
    }
  }
`;

export const GET_AGENT_BY_ID_QUERY = `
  query GetAgentById($id: ID!) {
    agent(id: $id) {
      id
      agentId
      name
      email
      phone
      department
      role
      status
      createdAt
    }
  }
`;

export const CREATE_AGENT_MUTATION = `
  mutation CreateAgent($input: AgentCreateInput!) {
    createAgent(input: $input) {
      agent {
        id
        agentId
        name
        email
        phone
        department
        role
        status
        createdAt
      }
      errors
      success
    }
  }
`;

export const UPDATE_AGENT_MUTATION = `
  mutation UpdateAgent($id: ID!, $input: AgentUpdateInput!) {
    updateAgent(id: $id, input: $input) {
      agent {
        id
        agentId
        name
        email
        phone
        department
        role
        status
        createdAt
      }
      errors
      success
    }
  }
`;

export const DELETE_AGENT_MUTATION = `
  mutation DeleteAgent($id: ID!) {
    deleteAgent(id: $id) {
      success
      errors
    }
  }
`;
