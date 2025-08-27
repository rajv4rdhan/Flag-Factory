#!/bin/bash
# Backup script for zoo database
# CONFIDENTIAL - DO NOT DISTRIBUTE

export DB_PASSWORD="zoo_backup_pass_2024"
export BACKUP_KEY="backup_encryption_key_secret"

# flag hidden here
echo "CTF{Sample_flag}" > /tmp/backup_flag.txt

pg_dump -h localhost -U admin zoo_db > backup_$(date +%Y%m%d).sql
