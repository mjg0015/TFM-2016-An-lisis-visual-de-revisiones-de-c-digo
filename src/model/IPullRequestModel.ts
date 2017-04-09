import * as mongoose from 'mongoose';

export interface IPullRequestDocument extends mongoose.Document {
    id: number,
    url: string,
    html_url: string,
    diff_url: string,
    patch_url: string,
    issue_url: string,
    commits_url: string,
    review_comments_url: string,
    review_comment_url: string,
    comments_url: string,
    statuses_url: string,
    number: number,
    state: string,
    title: string,
    body: string,
    assignee: any,
    milestone: any,
    locked: boolean,
    created_at: Date,
    updated_at: Date,
    closed_at: Date,
    merged_at: Date,
    head: any,
    base: any,
    _links: any,
    user: any,
    merge_commit_sha: string,
    merged: boolean,
    mergeable: boolean,
    merged_by: any,
    comments: number,
    commits: number,
    additions: number,
    deletions: number,
    changed_files: number,
    maintainer_can_modify: boolean
}

export let IPullRequestSchema: mongoose.SchemaDefinition = {
    id: Number,
    url: String,
    html_url: String,
    diff_url: String,
    patch_url: String,
    issue_url: String,
    commits_url: String,
    review_comments_url: String,
    review_comment_url: String,
    comments_url: String,
    statuses_url: String,
    number: Number,
    state: String,
    title: String,
    body: String,
    assignee: Object,
    milestone: Object,
    locked: Boolean,
    created_at: Date,
    updated_at: Date,
    closed_at: Date,
    merged_at: Date,
    head: Object,
    base: Object,
    _links: Object,
    user: Object,
    merge_commit_sha: String,
    merged: Boolean,
    mergeable: Boolean,
    merged_by: Object,
    comments: Number,
    commits: Number,
    additions: Number,
    deletions: Number,
    changed_files: Number,
    maintainer_can_modify: Boolean
}