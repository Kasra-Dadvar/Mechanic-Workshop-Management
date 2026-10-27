# Frontend Plan

## Purpose and source of truth

Plan a simple, relationship-driven frontend for managing Customers, Vehicles, Services, and Items. This document proposes architecture and implementation steps only; it does not introduce application code.

Reviewed sources:

- [Architecture.md](./Architecture.md)
- [BuisnesRules.md](./BuisnesRules.md) - the repository's filename for the business rules.
- [OpenAPI.json](./OpenAPI.json)
- The existing frontend [package.json](../src/Web/mechanic-workshop-react/package.json) and [source folder](../src/Web/mechanic-workshop-react/src).

**Scope:** single-user internal CRUD application. Authentication, authorization, dashboard, inventory management, invoicing, and advanced reporting remain out of scope.

**Core recommendation:** retain Customer -> Vehicle -> Service -> Item as the main workflow, but make it a navigation aid rather than a mandatory sequence of clicks.

**Main blocker:** the documented API has individual CRUD operations and relationship-list endpoints, but no customer-list endpoint and no response-body schemas.

---

## 1. User journeys

### 1.1 Find a customer and inspect their work

1. Open Customers, the initial landing page.
2. Find a customer by name, email, or phone.
3. Open their details.
4. Select an owned vehicle.
5. Select a service associated with that vehicle.
6. Inspect the service's items.
7. Open an item only when more detail or editing is needed.

Each detail page should show its immediate parent and provide a clear link back to it.

Customer search depends on the proposed customer-list API. Do not simulate a customer directory using individual-record lookups.

### 1.2 Register a new customer and vehicle

1. Select **New customer**.
2. Save the customer.
3. Navigate to the saved customer's details.
4. Select **Add vehicle**.
5. Display the selected customer as fixed context.
6. Save and navigate to the vehicle's details.

Avoid a combined customer-and-vehicle wizard initially. Separate saves simplify validation, recovery, and API integration.

### 1.3 Record a service and its items

1. Open a vehicle.
2. Select **Add service**.
3. Save the service and open its details.
4. Select **Add item**.
5. Save the item and return to the service's item list.
6. Repeat as needed.

An **Add another** option can follow once basic item creation works.

Service and item creation are separate API operations. A saved service must remain visible if creating an item fails; do not present the whole workflow as one atomic save.

### 1.4 Edit an existing record

1. Open its details.
2. Select **Edit**.
3. Change supported fields.
4. Save and return to details.

On validation or network failure, retain entered values and display a clear error. Cancel returns without saving; warn when discarding unsaved changes.

### 1.5 Delete a record

1. Select **Delete** from a secondary action area.
2. Show a confirmation naming the record.
3. Explain dependent-record consequences once the backend policy is defined.
4. Delete only after confirmation.
5. Navigate to the nearest surviving context:

| Deleted record | Destination |
|---|---|
| Customer | Customers |
| Vehicle | Owning customer |
| Service | Associated vehicle |
| Item | Associated service, if attached |

Do not assume cascading deletion is allowed. The API must enforce the policy even if the frontend detects dependent records.

Unattached items are not an established MVP workflow. If they are supported later, define a stable post-delete destination for them.

### 1.6 Open a bookmarked detail page

Opening a vehicle, service, or item URL directly must work after refresh and without previous navigation.

Parent relationships must come from API responses, not solely from browser history or temporary frontend state.

---

## 2. Route structure

Use **shallow canonical detail routes** and **parent-scoped creation routes**.

| Route | Purpose |
|---|---|
| `/` | Redirect to `/customers` |
| `/customers` | Customer directory |
| `/customers/new` | Create customer |
| `/customers/:customerId` | Customer details and vehicles |
| `/customers/:customerId/edit` | Edit customer |
| `/customers/:customerId/vehicles/new` | Create vehicle for customer |
| `/vehicles/:vehicleId` | Vehicle details and services |
| `/vehicles/:vehicleId/edit` | Edit vehicle |
| `/vehicles/:vehicleId/services/new` | Create service for vehicle |
| `/services/:serviceId` | Service details and items |
| `/services/:serviceId/edit` | Edit service |
| `/services/:serviceId/items/new` | Create item for service |
| `/items/:itemId` | Item details |
| `/items/:itemId/edit` | Edit item |
| Unmatched route | Application not-found page |

### Why not deeply nest every detail URL?

Avoid routes such as `/customers/:customerId/vehicles/:vehicleId/services/:serviceId/items/:itemId`.

They duplicate relationship information, require validating every parent-child combination, and become awkward if ownership changes.

Shallow detail routes provide one stable URL per record. Breadcrumbs communicate relationships independently of URL nesting.

### URL state

Keep customer search, sort, and page selection in query parameters so refresh and Back preserve the directory view.

Do not put unsaved form values or fetched entity objects in URLs.

### Deployment consideration

Frontend routes overlap existing API paths, including `/customers`.

For development, use a Vite proxy with an explicit API prefix. For deployment, choose either a separate API origin or a same-origin API prefix with appropriate routing.

Ensure SPA fallback routing does not intercept API requests. This is a deployment requirement, not a reason to rename existing endpoints immediately.

---

## 3. Page inventory

### Customers directory

- Customer name, email, phone.
- Search and result count when supported.
- Explicit links to customer details.
- **New customer** action.
- Loading, empty, no-results, and error states.

Prefer a simple table over cards for a business directory.

### Customer details

- Customer information.
- Owned vehicles, with plate and useful identifying information.
- **Add vehicle** as the main relationship action.
- **Edit customer** and secondary **Delete customer** actions.

### Vehicle details

- Vehicle information.
- Linked owner.
- Associated services.
- **Add service**, **Edit vehicle**, and **Delete vehicle** actions.

Display services newest first only after the API defines the relevant date field and ordering behavior.

### Service details

- Service name and recorded cost.
- Linked vehicle and customer context.
- Service dates and due information where returned and defined.
- Item table with name, cost, quantity, and actions.
- **Add item**, **Edit service**, and **Delete service** actions.

Do not calculate a service total until cost semantics are established.

### Item details

- Item information.
- Linked service context when attached.
- **Edit item** and **Delete item** actions.

Keep this page bookmarkable, but do not require users to visit it for routine editing. An **Edit** link in the service's item table should go directly to the item edit page.

### Create and edit pages

Use dedicated pages rather than modal forms initially:

- Predictable browser navigation.
- More room for validation.
- Easier refresh and direct-link behavior.
- Fewer focus-management concerns.

Reuse entity-specific form sections where create and update contracts overlap. They should not necessarily expose identical fields.

### API-specific form restrictions

According to [OpenAPI.json](./OpenAPI.json):

| Entity | Important restriction |
|---|---|
| Customer | Creation requires name and email; update properties have different optionality/nullability. |
| Vehicle | Update supports odometer, plate, customer, and rego, but not make, model, or year. |
| Service | Creation supports name, cost, and vehicle association; dates and due fields appear only in update. |
| Item | Update supports name, cost, and quantity, but not service reassignment. |

Do not show editable controls for fields the corresponding operation cannot save.

---

## 4. Navigation design

### Primary navigation

Start with:

- Application name linking to Customers.
- **Customers** as the only primary navigation destination.

Do not add empty dashboard, login, or future-feature links.

### Relationship navigation

Every detail page should include:

1. A breadcrumb trail.
2. A clear record title.
3. A linked immediate-parent summary.
4. Its child collection, where applicable.

Example breadcrumb:

**Customers -> Jane Smith -> ABC123 -> Oil service -> Oil filter**

Use meaningful labels, not raw UUIDs.

Breadcrumbs must be constructed from persisted relationships. While labels load, show placeholders rather than inventing a parent.

### Browser Back versus parent navigation

These serve different purposes:

- **Back** follows actual browsing history.
- **Customer**, **Vehicle**, or **Service** links navigate to a known relationship.

Do not use browser Back as the only way to leave a detail page.

### Future shortcut: vehicle lookup

The strongest next navigation improvement is likely **Find vehicle by plate**, rather than separate global lists for every entity.

A workshop user may know the vehicle but not the owner's name. Add this shortcut when vehicle search is available; keep customer-first navigation as the initial MVP.

---

## 5. Reusable component opportunities

Start with small, concrete shared components:

| Component | Responsibility |
|---|---|
| Application layout | Navigation and consistent page container |
| Page header | Title, subtitle, primary and secondary actions |
| Breadcrumbs | Relationship navigation |
| Form field | Label, input association, help text, validation error |
| Loading/error/empty states | Consistent asynchronous feedback |
| Confirmation dialog | Accessible destructive-action confirmation |
| Feedback message | Mutation success or failure |
| Pagination controls | Reusable only when paging exists |

Keep entity-specific components close to their pages:

- Customer form.
- Vehicle form and vehicle table.
- Service form and service table.
- Item form and item table.

**Avoid initially:**

- A schema-driven form generator.
- A universal CRUD page component.
- A configurable enterprise data grid.
- A frontend repository/unit-of-work abstraction.
- A large custom design system.

Extract shared behavior when actual repetition appears, not simply because all four entities use CRUD.

Use semantic tables, explicit links, keyboard-accessible actions, visible focus, and associated field errors from the beginning.

---

## 6. Data flow

### Recommended stack

Retain React, TypeScript, and Vite.

Add during implementation:

- **React Router** for routing.
- **TanStack Query** for server-state fetching, caching, and invalidation.
- Native **fetch** for HTTP requests.

Use local React state for form inputs and transient UI state. Do not introduce Redux or a global entity store.

TanStack Query is justified by the repeated need to refresh both individual records and their parent collections after mutations. Use its basic features only.

### Responsibility boundaries

**Page -> query or mutation hook -> entity API client -> shared HTTP helper -> backend**

- **Pages:** layout and user interaction.
- **Hooks:** query keys, mutations, invalidation.
- **Clients:** endpoint-specific requests and typed responses.
- **HTTP helper:** base URL, headers, cancellation, response parsing, normalized errors.
- **Models:** API request and response types.

Do not duplicate backend business rules in a separate frontend domain layer.

### Reading detail pages

Load record details and the immediate child collection independently where possible:

| Page | Documented requests |
|---|---|
| Customer | `GET /customers/{id}` and `GET /customers/{id}/vehicles` |
| Vehicle | `GET /vehicles/{id}` and `GET /vehicles/{id}/services` |
| Service | `GET /services/{id}` and `GET /services/{id}/items` |
| Item | `GET /items/{id}` |

Ancestor labels may require additional detail requests unless responses include parent summaries.

Do not preload the full customer-to-item graph. If a child-list request fails, keep successfully loaded parent information visible and allow retrying that section.

### Mutation behavior

For the MVP:

1. Disable repeated submission while saving.
2. Wait for backend confirmation.
3. Update or invalidate affected cached data.
4. Show success feedback.
5. Navigate to the intended destination.

Invalidate both detail and relationship-list data where affected. If ownership transfer is later enabled, invalidate both old and new customer vehicle lists.

Avoid optimistic updates and automatic mutation retries initially. A lost response after creation can otherwise lead to duplicate records.

### Errors and validation

- Distinguish loading, empty results, missing records, validation failures, and transport/server failures.
- Never convert a failed list request into an empty list.
- Show field errors where possible and a form-level error otherwise.
- Treat backend validation as authoritative.
- Mirror documented rules in the frontend for usability.
- Do not infer extra restrictions from field names alone.

The HTTP helper must accommodate documented empty responses; it must not always assume successful responses contain JSON.

---

## 7. Frontend folder structure

Preserve the layer-oriented frontend layout described by [Architecture.md](./Architecture.md), with feature subdivisions inside those layers.

The existing application lives in [mechanic-workshop-react](../src/Web/mechanic-workshop-react). There is no need to rename it merely to match the architecture document's conceptual "Frontend" label.

Proposed organization under its source directory:

| Proposed location | Contents |
|---|---|
| `app` | Router, application providers, layout |
| `components` | Shared UI only |
| `models/customers`, `models/vehicles`, `models/services`, `models/items` | Entity request/response types |
| `clients` | Shared HTTP helper and one API client per entity |
| `pages/customers`, `pages/vehicles`, `pages/services`, `pages/items` | Entity pages, forms, tables, and entity-specific query hooks |
| `styles` | Shared styling if existing styles need organization |

Guidelines:

- Keep page-only components within their entity's page folder.
- Promote components to shared UI only when reused.
- Keep tests beside the behavior they verify.
- Do not maintain competing `features` and `pages` hierarchies.
- Do not mirror backend Commands, Queries, Infrastructure, and Domain layers in React.

This permits feature-by-feature delivery without abandoning the existing architectural direction.

---

## 8. MVP implementation order

Work through these phases in order. Complete each exit condition before moving to the next phase.

### Phase 0 - Resolve the contract

Before building complete data-driven screens:

- [ ] Add customer listing.
- [ ] Document successful response bodies and identifiers.
- [ ] Document parent relationships in detail responses.
- [ ] Document validation errors and deletion behavior.
- [ ] Clarify update omission/null semantics.
- [ ] Resolve cost and date ambiguities.
- [ ] Agree on frontend/API routing for development and deployment.

**Exit condition:** each planned screen has a known request, response, and error contract.

### Phase 1 - Minimal foundation and Customers

- [ ] Add routing and application layout.
- [ ] Add the HTTP helper and query provider.
- [ ] Build the customer directory.
- [ ] Build customer creation and details.
- [ ] Build customer editing and deletion.
- [ ] Establish loading, empty, validation, and error patterns.
- [ ] Verify customer CRUD end to end, including direct-link refresh and failed saves.

**Exit condition:** customer CRUD works end to end, including direct-link refresh and failed saves.

### Phase 2 - Vehicles within Customers

- [ ] Build the customer vehicle collection.
- [ ] Build customer-scoped vehicle creation.
- [ ] Build vehicle details.
- [ ] Build supported vehicle editing and deletion.
- [ ] Add owner links and breadcrumbs.
- [ ] Verify navigation in both directions and refresh affected lists after mutations.

**Exit condition:** users can move in both directions between a customer and their vehicles.

### Phase 3 - Services within Vehicles

- [ ] Build the vehicle service collection.
- [ ] Build vehicle-scoped service creation.
- [ ] Build service details.
- [ ] Build service editing and deletion.
- [ ] Apply agreed date and cost presentation.
- [ ] Verify saved changes appear correctly in the vehicle's service list.

**Exit condition:** saved service changes appear correctly in the vehicle's service list.

### Phase 4 - Items within Services

- [ ] Build the service item collection.
- [ ] Build service-scoped item creation.
- [ ] Build item details.
- [ ] Build item editing and deletion.
- [ ] Add return-to-service behavior.
- [ ] Verify multiple items can be managed without restarting customer navigation.

**Exit condition:** multiple items can be managed without repeatedly navigating through customers and vehicles.

### Phase 5 - Workflow validation

- [ ] Verify direct navigation and refresh at every detail route.
- [ ] Verify browser Back and breadcrumb behavior.
- [ ] Verify stale-list invalidation after mutations.
- [ ] Verify empty collections versus failed requests.
- [ ] Verify validation, missing records, and delete conflicts.
- [ ] Verify unsaved-change handling.
- [ ] Verify keyboard navigation and narrow-screen usability.
- [ ] Verify production frontend/API routing.
- [ ] Run the existing build and lint commands.
- [ ] Run focused integration and end-to-end tests introduced during implementation.

**Exit condition:** the complete Customer -> Vehicle -> Service -> Item journey works reliably, including failure and recovery paths.

Do not build all four entity forms first and wire them later. Complete each vertical slice before repeating the pattern.

---

## 9. Risks and missing API capabilities

### 9.1 Required API additions or documentation

"Missing" here means **absent from the supplied OpenAPI contract**, not proof that the runtime implementation lacks it.

| Gap | Impact | Recommendation |
|---|---|---|
| No `GET /customers` | The proposed entry page cannot load customers. | Add customer listing with documented summary DTOs and stable ordering. |
| No response-body schemas | The frontend cannot reliably type details, lists, or mutation results. | Document all successful responses and whether collections are arrays or paged envelopes. |
| No documented creation result | The frontend cannot reliably navigate to a new record. | Return the created record or its ID; preferably document `201 Created` and `Location`. |
| Parent IDs are not documented in responses | Direct-link breadcrumbs and parent navigation are uncertain. | Include `customerId` on vehicle details, `vehicleId` on service details, and the agreed nullable/non-nullable `serviceId` on item details. |
| Only `200` responses are documented | Validation, missing records, and conflicts have no defined contract. | Document applicable `400`, `404`, `409`, and server-error responses using a consistent problem format. |
| Update behavior is unclear | Omitted or null values may accidentally clear or overwrite fields. | Define replacement versus partial-update semantics, explicit clearing, and route/body ID handling. |
| Deletion policy is undefined | A frontend cannot safely describe or predict child-record consequences. | Specify restrict, cascade, or another policy for each relationship; document conflict responses. |

Parent display summaries would reduce extra requests, but are an optimization. Correct parent IDs are the essential requirement.

### 9.2 Contract inconsistencies and business decisions

| Issue | Recommendation |
|---|---|
| A service must belong to a vehicle, but `vehicleId` is not marked required during creation. | Align request validation and documentation with the business rule. |
| An item "can be attached" to a service, while creation has an optional, non-nullable `serviceId`. | Define whether unattached items are valid and how absence is represented. |
| Service/item names are required properties but allow null. | Decide whether null names are genuinely supported; align client and server validation. |
| Item quantity is not required and has no documented bounds/default. | Define valid quantity behavior rather than choosing a frontend-only default. |
| Costs use `double`; currency and unit-versus-total meaning are unspecified. | Define monetary precision, currency, and whether service cost includes items. Prefer an explicit decimal monetary contract. |
| Service dates and due fields are only present on update. | Define creation defaults; add them to creation if historical service entry requires them. |
| Vehicle make/model/year cannot be updated. | Confirm intentional immutability or extend update to support correcting entry mistakes. |
| `rego` is nullable `date-time`, with unclear meaning. | Define its business meaning and whether it represents a calendar date or timestamp. |
| Vehicle ownership is editable through `customerId`. | Defer exposing transfer until its historical and navigation consequences are agreed. |

For deletion, **restricting parent deletion while children exist is the safer initial recommendation**, but it is not established by the current business rules.

### 9.3 Useful later capabilities

- `GET /vehicles?licensePlate=...` for direct vehicle lookup.
- Server-side customer search and pagination as data grows. If the first directory uses client-side search, it must receive the complete collection, not just one server page.
- Pagination and ordering for service histories if collections become large.
- Parent summaries in detail responses for efficient breadcrumb labels.
- Attachment/detachment operations only if unattached items become an approved workflow.

Global service and item list endpoints are **not required** for the proposed MVP.

### 9.4 Existing endpoints that are sufficient

The API already documents the three relationship lists:

- `GET /customers/{id}/vehicles`
- `GET /vehicles/{id}/services`
- `GET /services/{id}/items`

It also documents create, get-by-ID, update, and delete for all four entities.

Use the existing `/update` and `/delete` paths. Renaming them for stylistic REST consistency is not a frontend prerequisite.

---

## 10. Improvements to the proposed workflow

### Preserve hierarchy without forcing every click

Relationships should explain where a record belongs, not prevent direct access. Stable detail URLs, parent links, and later plate lookup achieve both.

### Make parent context automatic

Creating a vehicle from a customer should not ask the user to select that customer again. Apply the same principle to services and items.

Use the route's parent ID and confirm the parent exists; the backend must still validate the association.

### Put routine actions near the relevant collection

Allow direct item editing from the service's item table. After item creation or editing, return to the service when that was the launch context.

Use a validated in-app return destination or a known parent fallback, not browser history alone.

### Avoid making item details a compulsory step

Keep the page for completeness and direct links, but recognize that a small item may already be fully represented by its table row.

### Distinguish empty state from failure

Examples:

- "No vehicles yet" with **Add vehicle**.
- "Could not load vehicles" with **Retry**.

These must never be interchangeable.

### Do not assume "Item" means inventory

The current rules do not establish reusable stock items, product catalogues, stock quantities, or purchasing.

Treat service-associated items as the MVP working model, pending clarification. Do not add inventory concepts without new business rules.

### Surface incomplete workflows honestly

A service with no items is an empty collection, not automatically an error or an unfinished status. The current sources define no service lifecycle such as Draft or Completed.

---

## 11. Design decisions and reasoning

| Decision | Reasoning |
|---|---|
| Customers is the initial landing page | Supports the requested journey without inventing a dashboard. |
| Shallow detail routes | Stable links with less duplicated relationship state. |
| Parent-scoped creation | Prevents repetitive selection and association mistakes. |
| Dedicated form pages | Simpler navigation and validation than modal-heavy CRUD. |
| Entity-specific forms | Create/update contracts differ enough to make universal forms risky. |
| Basic TanStack Query usage | Handles shared server state without custom caching machinery. |
| Local form state | No demonstrated need for an application-wide state store. |
| Explicit save, then refresh | Easier to reason about than optimistic mutation behavior. |
| Existing architecture with feature subdivisions | Preserves project direction while supporting vertical slices. |
| Minimal primary navigation | Avoids empty or redundant top-level destinations. |
| No assumed totals, cascades, or reassignment | These are business decisions not established by the sources. |
| API contract work before full integration | Prevents implementing against guessed response shapes. |

### Final recommendation

Build a **customer-first, relationship-aware application with independently addressable detail pages**.

The proposed workflow is sound. Its most valuable improvements are automatic parent context, visible upward navigation, direct actions within child lists, and a future vehicle-lookup shortcut.

Keep implementation deliberately small: one entity slice at a time, a modest shared UI layer, typed API clients, and explicit server-state handling. Resolve the documented API gaps before relying on behavior the contract does not yet promise.