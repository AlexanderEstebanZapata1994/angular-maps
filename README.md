# Google Maps Playground in Angular

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Azure%20Static%20Web%20Apps-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://happy-moss-04dc2470f.5.azurestaticapps.net/)

An interactive Angular playground built to explore Google Maps Platform features and demonstrate an **Adapter Pattern (Contract-Based Architecture)** that decouples UI components from any specific map provider (Google Maps, Mapbox, Leaflet, MapLibre, etc.).

🌐 **Live Demo (Azure SWA):** [https://happy-moss-04dc2470f.5.azurestaticapps.net](https://happy-moss-04dc2470f.5.azurestaticapps.net/)

---

## 🎯 Purpose of the Project

This project was built as a dedicated playground for experimenting with **Google Maps Platform** in modern Angular (signals, control flow, standalone components). Its primary goals are:

- **Interactive Playground**: Experiment with map interactions, custom controls, dynamic marker management, zoom events, and responsive mini-map cards for property/real-estate listings.
- **Provider Decoupling**: Prevent vendor lock-in by abstracting map operations behind an interface contract, enabling seamless transitions or side-by-side implementations with other mapping providers.
- **Modern Angular Showcase**: Built with Angular 22+, utilizing modern Signals, `inject()`, input/output functions, Tailwind CSS, and DaisyUI components.
- **Cloud Deployment & CI/CD Practice**: Learn and apply deployment workflows using **Azure Static Web Apps**, **GitHub Actions**, **Azure Key Vault**, and Service Principal authentication.

---

## 🌐 Routing & Hash Strategy (`HashLocationStrategy`)

To ensure seamless client-side routing on static hosting environments like Azure Static Web Apps without server-side rewrite issues on direct page refreshes, the application configures Angular's **Hash Location Strategy** in [`app.config.ts`](file:///c:/Users/esteb/OneDrive/Documentos/Personal%20Projects/angular-course/angular-maps/src/app/app.config.ts):

```typescript
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    // Hash Strategy (e.g. /#/markers)
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
};
```

### Why Hash Strategy?
- Direct links like `/#/markers`, `/#/fullscreen`, or `/#/properties` route directly within the client app without requiring fallback rewrite rules (`staticwebapp.config.json` navigation fallbacks).
- Prevents 404 HTTP errors when refreshing deep URLs on static hosts.

---

## 🚀 CI/CD & Azure Deployment Pipeline

This personal project serves as hands-on practice implementing a secure continuous integration and continuous deployment pipeline using **GitHub Actions** and **Microsoft Azure**:

```
 ┌──────────────────────┐        ┌─────────────────────────┐        ┌─────────────────────────┐
 │   git push master    │───────►│  GitHub Actions Runner  │───────►│     Azure Key Vault     │
 └──────────────────────┘        │                         │        │  ('angular-maps-kv')    │
                                 │  1. Checkout repo       │        └────────────┬────────────┘
                                 │  2. Azure Login (SPN)   │                     │
                                 │  3. Fetch Google API Key│◄────────────────────┘
                                 │  4. Sed-replace env file│
                                 │  5. Build & Deploy      │───────►┌─────────────────────────┐
                                 └─────────────────────────┘        │ Azure Static Web Apps   │
                                                                    │ (happy-moss-04dc2470f)  │
                                                                    └─────────────────────────┘
```

### Key Workflow Highlights ([`azure-static-web-apps.yml`](https://github.com/AlexanderEstebanZapata1994/angular-maps/blob/master/.github/workflows/azure-static-web-apps.yml))

1. **Trigger on Push**: Automatically runs on every push to the `master` branch.
2. **Azure Service Principal Authentication**: Uses `azure/login@v2` with `AZURE_CREDENTIALS` stored in GitHub repository secrets for secure, non-interactive authentication.
3. **Secret Management with Azure Key Vault**:
   - Fetches the production `GoogleMapsApiKey` dynamically from Azure Key Vault (`angular-maps-kv`) via `azure/get-keyvault-secrets@v1`.
   - Prevents hardcoding or exposing sensitive API keys in source control.
4. **Environment Injection**:
   - Replaces the `GOOGLE_MAPS_KEY_PLACEHOLDER` in `src/environments/environment*.ts` at build time inside the runner.
5. **Static Web Apps Deployment**:
   - Uses `Azure/static-web-apps-deploy@v1` to compile the Angular application and deploy the output bundle (`dist/angular-maps/browser`) to Azure Static Web Apps.

---

## 📐 Architecture & Design Patterns

### The Adapter Pattern (`IMapService` Contract)

Instead of having UI components directly call vendor-specific APIs (like `google.maps.*`), the project implements the **Adapter Pattern** combined with **Angular Dependency Injection (`InjectionToken`)**:

```
 ┌────────────────────────────────────────────────────────┐
 │                      UI Components                     │
 │  (MapView, MiniMap, FullscreenMapPage, MarkersPage)    │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼ Injects MAP_SERVICE
 ┌────────────────────────────────────────────────────────┐
 │              IMapService (Contract Interface)          │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼ Implements Contract
 ┌────────────────────────────────────────────────────────┐
 │           GoogleMapsAdapter (Concrete Adapter)         │
 │            (Loads SDK, manages google.maps.*)          │
 └────────────────────────────────────────────────────────┘
```

#### Key Architecture Pieces:

1. **The Contract (`map-contract.interface.ts`)**:
   Defines the vendor-agnostic interface [`IMapService`] with common methods (`initMap`, `setCenter`, `setZoom`, `addMarker`, `removeMarker`, `clearMarkers`, `onMapClick`, `onZoomChanged`, `getUserLocation`, etc.) and declares the [`MAP_SERVICE`] `InjectionToken`.

2. **The Adapter Implementation (`google-maps.adapter.ts`)**:
   [`GoogleMapsAdapter`] implements [`IMapService`]. It handles dynamic loading of the Google Maps JS SDK (including `libraries=marker`), creation of modern `google.maps.marker.AdvancedMarkerElement`, gesture handling, geolocation, and cleanup.

3. **Pluggable Providers**:
   Components provide the adapter via Angular DI:
   ```typescript
   providers: [
     { provide: MAP_SERVICE, useClass: GoogleMapsAdapter }
   ]
   ```
   *To switch to Mapbox, MapLibre, or Leaflet, you simply write a corresponding adapter implementing `IMapService` and swap the provider configuration.*

4. **Reusable UI Wrapper (`map-view.ts`)**:
   A standalone [`MapView`](file:///c:/Users/esteb/Documents/Personal%20Projects/angular-course/angular-maps/src/app/shared/components/map-view/map-view.ts) component wraps any map container, binds to lifecycle hooks (`ngAfterViewInit`, `ngOnDestroy`), and exposes standard Angular inputs (`center`, `zoom`) and outputs (`mapClick`, `zoomChanged`).

---

## 🚀 Features Included

- 🗺️ **Fullscreen Map**: Dynamic viewport centering based on user geolocation, live coordinates display, and reactive zoom slider control.
- 📍 **Interactive Markers**: Click-to-add markers, list markers with coordinate badges, fly-to / re-center camera to any marker, and remove markers dynamically.
- 🏘️ **Property Cards with Mini Maps**: Real-estate house listing showcase embedding individual, non-interactive mini-maps with markers for each property.

---

## 🛠️ Setting Up the Project

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9+)

---

### Step 1: Obtain a Google Maps Platform API Key

To run the Google Maps features, you need an API key from Google Cloud:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Library**.
4. Search for and enable the **Maps JavaScript API**.
5. Go to **APIs & Services > Credentials**.
6. Click **+ Create Credentials** > **API key**.
7. *(Recommended)* Click **Edit API key** to configure:
   - **Application restrictions**: Set to *Websites* and add `http://localhost:4200/*` for local testing.
   - **API restrictions**: Restrict the key to **Maps JavaScript API**.
8. Copy your generated API key.

---

### Step 2: Clone the project and Install dependencies

```bash
# Clone repository
git clone <repository-url>
cd angular-maps

# Install dependencies
npm install
```

---

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root based on [`.env.template`](file:///.env.template):
   ```bash
   # Copy the template manually or create .env
   cp .env.template .env
   ```

2. Open `.env` and add your Google Cloud API key:
   ```env
   API_KEY_MAPS="YOUR_ACTUAL_GOOGLE_MAPS_API_KEY"
   ```

3. Run the script to generate Angular environment configuration files:
   ```bash
   npm run set-envs
   ```
   *This command populates `src/environments/environment.ts` and `src/environments/environment.development.ts` safely without committing your keys to git.*

---

### Step 4: Run the Application

```bash
npm start or ng serve -o
```

Navigate to `http://localhost:4200/` in your browser.
