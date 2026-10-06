# Phase 2 — Deploy Both Challenges on Kubernetes

**Goal:** run **both** challenges — the existing Zoo web challenge and the new
Maze LLM jailbreak — on Kubernetes, reachable by users at their own URLs.

**Depends on:** Phase 1 (a working Maze).

---

## 1. Scope

- Local Kubernetes first (k3d) so it is reproducible and cheap.
- Deploy:
  - **Zoo** (existing `web/zoo`): Go/Gin backend + React frontend + Postgres.
  - **LLM Jailbreak** (phase 1): frontend + backend + inference.
- Ingress so each challenge has its own host/path.
- This is a *plain* deployment — no GitOps/CI/autoscaling yet (that is phase 4).

---

## 2. Cluster

Use **k3d** locally (k3s in Docker), 1 server + 1 agent, ingress ports mapped:

```bash
k3d cluster create flagfactory \
  --servers 1 --agents 1 \
  -p "80:80@loadbalancer" -p "443:443@loadbalancer"
```

Install **ingress-nginx** as the single ingress controller.

Namespaces:
- `zoo`
- `maze`

---

## 3. Deploy the Zoo web challenge (`zoo`)

Zoo already has a `Dockerfile` and `docker-compose.yml`; convert to Kubernetes.

- `Deployment` (+ `Service`) for `zoo-app` (image from `web/zoo/Dockerfile`;
  Zoo's multi-stage build already serves the built frontend from the Go backend).
- `StatefulSet` (or `Deployment` + `PVC`) for Postgres 15-alpine.
- `ConfigMap` for non-secret env; `Secret` for DB credentials + flag.
- Probes (readiness/liveness), resource requests/limits.
- `Ingress` → `zoo.local`.
- Seed the DB (reuse `scripts/init-db.go` as an init `Job`).

## 4. Deploy the Maze challenge (`maze`)

Three workloads from phase 1:
- `frontend` Deployment + Service (static build served by nginx or embedded).
- `backend` Deployment + Service (`/api/ask`).
- `inference` Deployment + Service (llama.cpp, **ClusterIP only**).
- `ConfigMap` for prompts/non-secrets; `Secret` for `FLAG`.
- Model artifact: bake into the inference image **or** an initContainer/PVC that
  downloads the GGUF (keeps the image small).
- Probes: **slow `startupProbe`** for model load; `readinessProbe` gates traffic.
- Resource limits sized for CPU inference.
- `Ingress` → `maze.local` (frontend) with backend under `/api`; inference
  NOT exposed.

## 5. Packaging & access

- Package each app as a **Helm chart** (or Kustomize overlay):
  - `llm/maze/deploy/helm/maze/`
  - `web/zoo/deploy/helm/zoo/`
- Ingress layout (pick one):
  - subdomains `zoo.local`, `maze.local` (recommended), or
  - paths `/zoo`, `/maze`.
- Add hosts entries for local testing; document in `docs/deploy.md`.
- A single `scripts/deploy-all.sh` installs both.

---

## 6. Cross-cutting (minimum viable)

- `ConfigMap`/`Secret` separation; no flags in Git.
- Basic NetworkPolicy: `maze` backend is the only caller of `inference`;
  only ingress reaches the frontends.
- Resource requests/limits on every pod (protects the dev box).
- Namespaced RBAC with no cluster-admin for app service accounts.

> Advanced security (Kyverno, secrets operators, WAF) is phase 4.

---

## Deliverables

- `web/zoo/deploy/helm/zoo/` (or k8s manifests)
- `llm/maze/deploy/helm/maze/`
- `scripts/deploy-all.sh`
- `docs/deploy.md` (how to reach both challenges)

## Done when

- `kubectl get pods -A` → both challenges fully `Running`/`Ready`.
- `http://zoo.local` serves the Zoo challenge; its flags are solvable.
- `http://maze.local` serves the chat; the jailbreak leaks the flag.
- `inference` is not reachable from outside the cluster.
- Restarting a pod recovers without manual steps (probes work).

## Notes

- Keep phase 1's local `docker-compose.yml` for fast iteration; k8s is the
  shared/deployable environment.
- The existing `.github/workflows/zoo-ctf-docker.yml` still works for Zoo's
  current Render deploy; phase 4 replaces/augments it.
