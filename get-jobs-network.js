function get_jobs_network(graph, user_profile) {
    console.log(graph);
    

    var i, j;
    for (i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].Role_Match_Score = 0;
        graph.nodes[i].size = 6;

        job_role = graph.nodes[i].job_role;

        for (j = 0; j < user_profile.length; j++) {
            if (job_role.localeCompare(user_profile[j].Role) == 0) {
                graph.nodes[i].Role_Match_Score = user_profile[j].Role_Match_Score;

                // temporal value
                graph.nodes[i].size = 10; 
                graph.nodes[i].group = 2;
                break;
            }
        }
    }

    console.log(graph);
    
    return graph;
}