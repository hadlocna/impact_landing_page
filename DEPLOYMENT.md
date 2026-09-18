# Deployment

Coolify deploys `main` using the Static build pack, `nginx:alpine`, base
directory `/`, and domain `https://impact.pelaterra.com`.
The root landing page, PDFs, `images/`, and `impactreports/` are the published
site. The Astro authoring project in `report-src/` generates committed output;
see its README for rebuilding a report before committing changes.

`.dockerignore` excludes Git metadata, authoring sources, dependencies, and
documentation from the Docker build context and static image. It preserves
the published reports and PDFs as well as Coolify-generated configuration.

## Checkout fails with "No space left on device"

This is a deployment-host storage failure, before the application image build.
Changing `.dockerignore` reduces subsequent build/image storage, but cannot
fix a full filesystem during Git checkout.

1. On the target Coolify server, check `df -h / /var/lib/docker` and `df -i /`.
2. Inspect Docker storage with `docker system df` and the server's Docker
   Cleanup execution logs. A successful cleanup does not prove sufficient
   free space remains.
3. Review cleanup scope before deleting anything. Keep volume/network deletion
   disabled and application image retention enabled. Never remove database
   volumes or application data to make room for a deployment.
4. Reclaim confirmed disposable build data, or expand host storage if retained
   applications and data need the capacity. Leave headroom for concurrent builds.
5. Redeploy `main`, confirm the deployed commit, and verify the landing page,
   both 2025 reports, and PDF downloads on the public domain.

Coolify cleanup reference:
https://coolify.io/docs/core/infrastructure/servers/automated-docker-cleanup
