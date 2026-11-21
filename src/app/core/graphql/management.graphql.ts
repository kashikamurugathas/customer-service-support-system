export const GET_USERS_QUERY = `
  query GetUsers($page: Int, $pageSize: Int) {
    allUsers(page: $page, pageSize: $pageSize) {
      items {
        userId
        fullName
        email
        role
        accountStatus
        createdAt
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_TICKETS_QUERY = `
  query GetTickets($search: String, $status: String, $page: Int, $pageSize: Int) {
    allTickets(search: $search, status: $status, page: $page, pageSize: $pageSize) {
      items {
        ticketId
        ticketNumber
        ticketStatus
        createdAt
        resolvedAt
        complaint {
          complaintSubject
          customer {
            userId {
              fullName
            }
          }
        }
        priority {
          priorityName
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_COMPLAINTS_QUERY = `
  query GetComplaints($search: String, $status: String, $page: Int, $pageSize: Int) {
    allComplaints(search: $search, status: $status, page: $page, pageSize: $pageSize) {
      items {
        complaintId
        complaintSubject
        complaintDescription
        complaintCategory
        complaintValue
        source
        sentiment
        status
        createdAt
        customer {
          customerId
          userId {
            fullName
            email
          }
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_PRIORITIES_QUERY = `
  query GetPriorities($search: String, $page: Int, $pageSize: Int) {
    allPriorities(search: $search, page: $page, pageSize: $pageSize) {
      items {
        priorityId
        priorityName
        priorityLevel
        description
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_FEEDBACK_QUERY = `
  query GetFeedback($search: String, $rating: Int, $page: Int, $pageSize: Int) {
    allFeedbacks(search: $search, rating: $rating, page: $page, pageSize: $pageSize) {
      items {
        feedbackId
        rating
        feedbackComments
        createdAt
        ticket {
          ticketNumber
        }
        customer {
          customerId
          userId {
            fullName
          }
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_SLA_RULES_QUERY = `
  query GetSlaRules($page: Int, $pageSize: Int) {
    allSlaRules(page: $page, pageSize: $pageSize) {
      items {
        slaRuleId
        responseTimeMinutes
        resolutionTimeMinutes
        workingHours
        plan {
          planName
        }
        priority {
          priorityName
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_SLA_TRACKING_QUERY = `
  query GetSlaTracking($page: Int, $pageSize: Int) {
    allSlaTracking(page: $page, pageSize: $pageSize) {
      items {
        slaTrackingId
        responseDueAt
        resolutionDueAt
        responseStatus
        resolutionStatus
        ticket {
          ticketNumber
        }
        slaRule {
          responseTimeMinutes
          resolutionTimeMinutes
          plan {
            planName
          }
          priority {
            priorityName
          }
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_REPORTS_QUERY = `
  query GetReports($search: String, $reportType: String, $agentId: Int, $page: Int, $pageSize: Int) {
    allReports(
      search: $search
      reportType: $reportType
      agentId: $agentId
      page: $page
      pageSize: $pageSize
    ) {
      items {
        reportId
        reportTitle
        reportType
        reportData
        filePath
        createdAt
        generatedBy {
          fullName
        }
        ticket {
          ticketNumber
        }
        agent {
          agentId
          userId {
            fullName
          }
        }
      }
      pagination {
        currentPage
        perPage
        totalPages
        totalItems
        hasNext
        hasPrevious
      }
    }
  }
`;
