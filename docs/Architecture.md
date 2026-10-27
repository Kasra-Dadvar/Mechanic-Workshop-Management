- src

    Domain:
        Entities only

    Application: (for each entity)
        Commands
        Queries
        DTOs 

    Infrastructure:
        EF Core:
            customer
            vehicle
            service
            item

    Web:
        Endpoints
        Frontend:
            src:
                components:
                    Reusable UI
                models:
                    interfaces
                clients:
                    API calls
                pages: 
                    screens
